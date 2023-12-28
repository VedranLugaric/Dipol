from datetime import datetime, timezone
from flask import request, jsonify, make_response
from passlib.hash import pbkdf2_sha256
from app import app, db
from app.models import Konferencija, Sudionik, generate_session_id

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
            response = make_response({'poruka': 'Prijava uspješna'})
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