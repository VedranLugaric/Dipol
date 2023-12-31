from datetime import datetime, timezone
from flask import request, jsonify, make_response
from passlib.hash import pbkdf2_sha256
from app import app, db
from app.models import Konferencija, Sudionik, Rad, Posteri, Prezentacija, Rad_se_predstavlja_na, Sudionik_sudjeluje_na, Sudionik_je_administrator, generate_session_id

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
            session_id = generate_session_id()
            korisnik_info = {
                'id': korisnik.id_sud,
                'ime': korisnik.ime,
                'prezime': korisnik.prezime,
            }
            response = make_response({'poruka': 'Prijava uspješna', 'korisnik': korisnik_info})
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
    rez = [{'naziv': konf.naziv, 'mjesto': konf.mjesto, 'opis': konf.opis, 'vrijeme_poc': konf.vrijeme_poc, 'vrijeme_zav': konf.vrijeme_zav, 'video' : konf.video, 'lozinka' : konf.lozinka} for konf in podaci]
    for rez1 in rez:   
        if ((rez1["vrijeme_poc"] <= vrijeme)) and (rez1["vrijeme_zav"] > vrijeme):
            aktivne.append(rez1)
        elif ((rez1["vrijeme_poc"] > vrijeme)):
            nadolazece.append(rez1)
    return jsonify({'aktivne': aktivne, 'nadolazece': nadolazece})

@app.route('/api/poster/<int:konferencijaId>', methods=['GET'])
def dohvati_postere(konferencijaId):
    radovi = []
    rez = []
    rez2 = []

    query = (
        db.session.query(Rad)
        .join(Rad_se_predstavlja_na, Rad_se_predstavlja_na.id_rad == Rad.id_rad, isouter=True)
        .join(Sudionik, Sudionik.id_sud == Rad.id_sud, isouter=True)
        .join(Posteri, Posteri.id_poster == Rad_se_predstavlja_na.id_poster, isouter=True)
        .join(Prezentacija, Prezentacija.id_prez == Rad_se_predstavlja_na.id_prez, isouter=True)
        .filter(Rad_se_predstavlja_na.id_konf == konferencijaId)
    )

    query2 = (
        db.session.query(Konferencija)
        .filter(Konferencija.id_konf == konferencijaId)
    )

    imeKonferencije = query2[0].naziv
    ime = [
        {
            'nazivKonf': imeKonferencije
        }
    ]

    radovi = [
        {
            'id': rad.id_rad,
            'naslov': rad.naslov,
            'autor': f"{rad.sudionik.prezime}, {rad.sudionik.ime}",
            'poster': Posteri.query.get(rad.radSePredstavljaNa[0].id_poster).poster,
            'prezentacija': Prezentacija.query.get(rad.radSePredstavljaNa[0].id_prez).prez if Prezentacija.query.get(rad.radSePredstavljaNa[0].id_prez) else None        
        }
        for rad in query
    ]

    for rad in radovi:   
        rez2.append(rad)

    rez.append(ime)
    rez.append(rez2)

    return jsonify({'rezultat': rez})