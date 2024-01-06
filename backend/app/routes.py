from datetime import datetime, timezone
from flask import request, jsonify, make_response, render_template
from passlib.hash import pbkdf2_sha256
from app import app, db, admin_permission, author_permission, user_permission, superadmin_permission
from app.models import Konferencija, Sudionik, Roles, Sudionik_sudjeluje_na, generate_session_id
from app.utils import upload_to_gcs, save_to_database, generate_unique_filename

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

        new_entry = Sudionik_sudjeluje_na(id_konf=konferencija_id, id_sud=user_id)

        db.session.add(new_entry)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500