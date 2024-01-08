from datetime import datetime, timezone
from flask import request, jsonify, make_response, render_template
from passlib.hash import pbkdf2_sha256
from app import app, db
from app.models import generate_session_id, Konferencija, Sudionik, Roles, Sudionik_sudjeluje_na, Rad_se_predstavlja_na, Rad, Posteri
from app.utils import upload_to_gcs, save_to_database, generate_unique_filename
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

@app.route('/api/registracija/', methods=['POST'])
def registracija():
    try:
        data = request.get_json()

        if data.get('lozinkaPotvrda') != data.get('lozinka'):
            return jsonify({'poruka': 'Lozinke se ne podudaraju!'}), 400

        lozinka = data['lozinka']
        hashed_password = pbkdf2_sha256.hash(lozinka)

        novi_sudionik = Sudionik(
            ime=data['ime'],
            prezime=data['prezime'],
            email=data['email'],
            lozinka=hashed_password
        )

        default_role = Roles.query.filter_by(name='user').first()

        novi_sudionik.role.append(default_role)

        db.session.add(novi_sudionik)
        db.session.commit()

        return jsonify({'poruka': 'Registracija uspješna'}), 201
    except Exception as e:
        print(f'Greška pri registraciji: {str(e)}')
        return jsonify({'poruka': 'Pogreška prilikom registracije'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        email = data.get('email')
        lozinka = data.get('lozinka')

        korisnik = Sudionik.query.filter_by(email=email).first()

        if korisnik and pbkdf2_sha256.verify(lozinka, korisnik.lozinka):
            user_role = [role.name for role in korisnik.role]

            session_id = generate_session_id()
            korisnik_info = {
                'id': korisnik.id_sud,
                'ime': korisnik.ime,
                'prezime': korisnik.prezime,
                'role': user_role,
            }

            response = make_response(jsonify(korisnik_info))
            response.set_cookie('session_id', session_id)
            return response
        else:
            return jsonify({'poruka': 'Pogrešan e-mail ili lozinka'}), 401

    except Exception as e:
        app.logger.error(f'Greška pri prijavi: {str(e)}')
        return jsonify({'poruka': 'Pogreška prilikom prijave'}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    response = make_response({'poruka': 'Odjava uspješna'})
    response.set_cookie('session_id', '', expires=0)
    return response

@app.route('/api/konferencije', methods=['GET'])
def dohvati_konferencije():
    rez = []
    aktivne = []
    nadolazece = []
    vrijeme = datetime.now(timezone.utc)
    podaci = Konferencija.query.all()
    rez = [{'id': konf.id_konf, 'naziv': konf.naziv, 'mjesto': konf.mjesto, 'opis': konf.opis, 'vrijeme_poc': konf.vrijeme_poc, 'vrijeme_zav': konf.vrijeme_zav, 'video' : konf.video, 'lozinka' : konf.lozinka} for konf in podaci]
    for rez1 in rez:   
        if ((rez1["vrijeme_poc"] <= vrijeme)) and (rez1["vrijeme_zav"] > vrijeme):
            aktivne.append(rez1)
        elif ((rez1["vrijeme_poc"] > vrijeme)):
            nadolazece.append(rez1)
    return jsonify({'aktivne': aktivne, 'nadolazece': nadolazece})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part", 400

    uploaded_file = request.files['file']

    if uploaded_file.filename == '':
        return "No selected file", 400

    unique_filename = generate_unique_filename(uploaded_file.filename)

    destination_blob_name = f'images/{unique_filename}'

    upload_to_gcs(uploaded_file, 'progi', destination_blob_name)


    image_link = f'https://storage.googleapis.com/progi/{destination_blob_name}'


    naslov_rad = request.form.get('nazivPostera')
    user_id = request.form.get('korisnikId')
    konf_id = request.form.get('konferencijaId')

    save_to_database(naslov_rad, image_link, konf_id, user_id)


    return jsonify({"image_link": image_link})

@app.route('/api/create_user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()

        konferencija_id = data.get('konferencijaId')
        user_id = data.get('korisnikId')

        existing_entry = Sudionik_sudjeluje_na.query.filter_by(id_konf=konferencija_id, id_sud=user_id).first()

        if existing_entry:
            return jsonify({"message": "Korisnik već postoji za ovu konferenciju"}), 200

        new_entry = Sudionik_sudjeluje_na(id_konf=konferencija_id, id_sud=user_id)

        db.session.add(new_entry)
        db.session.commit()

        return jsonify({"message": "Korisnik uspješno stvoren"}), 201

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": "Neuspješno stvaranje korisnika. IntegrityError: " + str(e)}), 500

    except Exception as e:
        return jsonify({"error": "Neuspješno stvaranje korisnika. " + str(e)}), 500

@app.route('/api/posteri/<int:konferencijaId>', methods=['POST'])
def get_conference_posteri(konferencijaId):
    try:
        sudionik_id = request.json.get('id_sud')
        konferencija = Konferencija.query.get(konferencijaId)

        if not konferencija:
            return jsonify({"error": "Konferencija ne postoji"}), 404

        if not konferencija.aktivna:
            return jsonify({"error": "Konferencija nije aktivna ili trenutno nije vrijeme konferencije"}), 403

        sudionik_sudjeluje_na_entry = Sudionik_sudjeluje_na.query.filter_by(id_konf=konferencijaId, id_sud=sudionik_id).first()

        if sudionik_sudjeluje_na_entry:
            posteri_data = (
                db.session.query(Rad_se_predstavlja_na)
                .filter(Rad_se_predstavlja_na.id_konf == konferencijaId)
                .all()
            )

            radovi_data = (
                db.session.query(Rad)
                .join(Rad_se_predstavlja_na, Rad.id_rad == Rad_se_predstavlja_na.id_rad)
                .filter(Rad_se_predstavlja_na.id_konf == konferencijaId)
                .all()
            )

            posteri = [
                {
                    "poster_id": poster.id_poster,
                    "poster_image_link": poster.posteri.poster,
                }
                for poster in posteri_data
            ]

            radovi = [
                {
                    "rad_id": rad.id_rad,
                    "naslov": rad.naslov,
                }
                for rad in radovi_data
            ]

            return jsonify({"posteri": posteri, "radovi": radovi}), 200

        return jsonify({"error": "Sudionik nije registriran za ovu konferenciju"}), 403

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/dodaj_konf', methods=['POST'])
def dodaj_konferenciju():
    if request.method == 'POST':
        data = request.json

        naziv = data.get('naziv')
        mjesto = data.get('mjesto')
        vrijeme_poc = data.get('vrijemePocetka')
        vrijeme_zav = data.get('vrijemeKraja')
        opis = data.get('opis')
        lozinka = data.get('konfLozinka')
        video = data.get('video')

        nova_konferencija = Konferencija(
            naziv=naziv,
            mjesto=mjesto,
            vrijeme_poc=vrijeme_poc,
            vrijeme_zav=vrijeme_zav,
            opis=opis,
            lozinka=lozinka,
            video=video
        )

        db.session.add(nova_konferencija)
        db.session.commit()

        return jsonify({'message': 'Konferencija uspješno dodana!'})
    

@app.route('/api/vote/<int:rad_id>', methods=['POST'])
def vote(rad_id):
    data = request.get_json()
    user_id = data.get('id_sud')
    konferencijaId = data.get('konferencijaId')
    
    if not user_id or not konferencijaId:
        return jsonify({'error': 'Potrebni su ID korisnika i ID konferencije'}), 400

    try:
        existing_vote = Sudionik_sudjeluje_na.query.filter_by(id_sud=user_id, id_konf=konferencijaId).first()

        if existing_vote and existing_vote.glasovao == 1:
            return jsonify({'error': 'Korisnik je već glasao za ovu konferenciju'}), 400

        rad_se_predstavlja_na = Rad_se_predstavlja_na.query.filter_by(id_rad=rad_id, id_konf=konferencijaId).first()

        if rad_se_predstavlja_na:
            rad_se_predstavlja_na.br_glasova += 1
        else:
            return jsonify({'error': 'Zapis za Rad_se_predstavlja_na ne postoji'}), 400

        if existing_vote:
            existing_vote.glasovao = 1
        else:
            new_vote = Sudionik_sudjeluje_na(id_sud=user_id, id_konf=konferencijaId, glasovao=1)
            db.session.add(new_vote)

        db.session.commit()

        return jsonify({'message': 'Glas uspješno zabilježen'})
    except IntegrityError as e:
        db.session.rollback()
        print(f"IntegrityError: {str(e)}")
        return jsonify({'error': 'Pogreška prilikom zapisivanja glasa'}), 500


@app.route('/api/past_conferences', methods=['GET'])
def get_past_conferences():
    try:
        past_conferences = Konferencija.query.filter(Konferencija.vrijeme_zav < datetime.now()).all()

        conferences_data = [
            {
                'id_konf': conference.id_konf,
                'naziv': conference.naziv,
                'mjesto': conference.mjesto,
                'vrijeme_poc': conference.vrijeme_poc.isoformat(),
                'vrijeme_zav': conference.vrijeme_zav.isoformat(),
                'video': conference.video,
                'opis': conference.opis,
                'lozinka': conference.lozinka,
                'aktivna': conference.aktivna,
            }
            for conference in past_conferences
        ]

        return jsonify({'conferences': conferences_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/past_conference/<int:conference_id>', methods=['GET'])
def get_past_conference(conference_id):

    conference = Konferencija.query.get_or_404(conference_id)

    rad_data = (
    Rad.query
    .outerjoin(Rad_se_predstavlja_na, (Rad.id_rad == Rad_se_predstavlja_na.id_rad) & (Rad_se_predstavlja_na.id_konf == conference_id))
    .join(Sudionik, Rad.id_sud == Sudionik.id_sud)
    .filter(Rad_se_predstavlja_na.id_konf == conference_id)
    .with_entities(
        Rad.id_rad,
        Rad.naslov,
        func.coalesce(func.max(Rad_se_predstavlja_na.br_glasova), 0).label('br_glasova'),
        Sudionik.ime,
        Sudionik.prezime
    )
    .group_by(Rad.id_rad, Sudionik.ime, Sudionik.prezime)
    .order_by(func.max(Rad_se_predstavlja_na.br_glasova).desc())
    .all()
    )



    response = {
        'conference': {
            'id': conference.id_konf,
            'name': conference.naziv,
            'place': conference.mjesto,
            'start_time': conference.vrijeme_poc,
            'end_time': conference.vrijeme_zav,
            'video': conference.video,
            'description': conference.opis,
            'password': conference.lozinka,
            'active': conference.aktivna,
        },
        'rad_data': [
            {
                'id_rad': rad.id_rad,
                'naslov': rad.naslov,
                'br_glasova': rad.br_glasova,
                'ime_sudionika': rad.ime,
                'prezime_sudionika': rad.prezime,
            }
            for rad in rad_data
        ],
    }

    return jsonify(response), 200