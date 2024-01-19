from datetime import datetime, timezone
import secrets
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from passlib.hash import pbkdf2_sha256
from sqlalchemy import ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

app = Flask(__name__)
CORS(app, supports_credentials=True,)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/postgres'
db = SQLAlchemy(app)
secret_key = secrets.token_hex(16)
app.secret_key = secret_key

def generate_session_id():
    return secrets.token_hex(16)

login_manager = LoginManager(app)
login_manager.login_view = 'login'

class Konferencija(db.Model):
    __tablename__ = 'konferencija'
    id_konf = db.Column(db.Integer, primary_key=True)
    naziv = db.Column(db.String(100))
    mjesto = db.Column(db.String(100))
    vrijeme_poc = db.Column(db.TIMESTAMP(timezone = True))
    vrijeme_zav = db.Column(db.TIMESTAMP(timezone = True))
    video = db.Column(db.String(200))
    opis = db.Column(db.String(1000))
    lozinka = db.Column(db.String(100))

    sudionikSudjelujeNa = relationship('Sudionik_sudjeluje_na')
    sudionikJeAdministrator = relationship('Sudionik_je_administrator')
#    pokroviteljSponzorira = relationship('Pokrovitelj_sponzorira')

class Sudionik(db.Model):
    __tablename__ = 'sudionik'
    id_sud = db.Column(db.Integer, primary_key=True)
    ime = db.Column(db.String(50))
    prezime = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True, nullable=False)
    lozinka = db.Column(db.String(128))

    rad = relationship('Rad')
    sudionikSudjelujeNa = relationship('Sudionik_sudjeluje_na')
    sudionikJeAdministrator = relationship('Sudionik_je_administrator')

    def get_id(self):
        return str(self.id_sud)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

class Rad(db.Model):
    __tablename__ = 'rad'

    id_rad = db.Column(db.Integer, primary_key=True)
    naslov = db.Column(db.String(100))
    id_sud = db.Column(db.Integer, ForeignKey('sudionik.id_sud'))

    sudionik = relationship('Sudionik')
    radSePredstavljaNa = relationship('Rad_se_predstavlja_na')

class Posteri(db.Model):
    __tablename__ = 'posteri'

    id_poster = db.Column(db.Integer, primary_key=True)
    poster = db.Column(db.String(200))

    radSePredstavljaNa = relationship('Rad_se_predstavlja_na')

class Prezentacija(db.Model):
    __tablename__ = 'prezentacija'

    id_prez = db.Column(db.Integer, primary_key=True)
    prez = db.Column(db.String(200))

class Rad_se_predstavlja_na(db.Model):
    __tablename__ = 'rad_se_predstavlja_na'

    id_poster = db.Column(db.Integer, ForeignKey('posteri.id_poster'), primary_key=True)
    id_prez = db.Column(db.Integer, ForeignKey('prezentacija.id_prez'), default=None, primary_key=True)
    id_rad = db.Column(db.Integer, ForeignKey('rad.id_rad'), primary_key=True)
    id_konf = db.Column(db.Integer, ForeignKey('konferencija.id_konf'), primary_key=True)
    br_glasova = db.Column(db.Integer, default=0)

    posteri = relationship('Posteri')
    prezentacija = relationship('Prezentacija')
    rad = relationship('Rad')
    konferencija = relationship('Konferencija')

class Sudionik_sudjeluje_na(db.Model):
    __tablename__ = 'sudionik_sudjeluje_na'

    glasovao = db.Column(db.Integer, CheckConstraint('Glasovao IN (0, 1)'), default=0)

    id_konf = db.Column(db.Integer, ForeignKey('konferencija.id_konf'), primary_key=True)
    konferencija = relationship('Konferencija')

    id_sud = db.Column(db.Integer, ForeignKey('sudionik.id_sud'), primary_key=True)
    sudionik = relationship('Sudionik')

class Sudionik_je_administrator(db.Model):
    __tablename__ = 'sudionik_je_administrator'

    id_konf = db.Column(db.Integer, ForeignKey('konferencija.id_konf'), primary_key=True)
    konferencija = relationship('Konferencija')
    
    id_sud = db.Column(db.Integer, ForeignKey('sudionik.id_sud'), primary_key=True)
    sudionik = relationship('Sudionik')


#class Pokrovitelj(db.Model):
#    __tablename__ = 'pokrovitelj'
#
#    id_pokrovitelj = db.Column(db.Integer, primary_key=True)
#    ime = db.Column(db.String(100))
#
#    pokroviteljSponzorira = relationship('Pokrovitelj_sponzorira')
#    reklama = relationship('Reklama')

#class Pokrovitelj_sponzorira(db.Model):
#
#    id_pokrovitelj = db.Column(db.Integer, ForeignKey('Pokrovitelj.id_pokrovitelj', ondelete='CASCADE'), primary_key=True)
#    pokrovitelj = relationship('Pokrovitelj')
#
#    id_konf = db.Column(db.Integer, ForeignKey('Konferencija.id_konf'), primary_key=True)
#    konferencija = relationship('Konferencija')

#class Reklama(db.Model):
#
#    id_reklama = db.Column(db.Integer, primary_key=True)
#    sadrzaj = db.Column(db.String(200))
#
#    id_pokrovitelj = db.Column(db.Integer, ForeignKey('Pokrovitelj.id_pokrovitelj', ondelete='CASCADE'), nullable=False)
#    pokrovitelj = relationship('Pokrovitelj')

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

@login_manager.user_loader
def load_user(user_id):
    return Sudionik.query.get(int(user_id))

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

@app.route('/api/poster/<int:konferencijaId>', methods=['GET'])
def dohvati_postere(konferencijaId):
    red1 = []
    rez = []

    query1 = (
        db.session.query(Rad)
        .join(Rad_se_predstavlja_na, Rad_se_predstavlja_na.id_rad == Rad.id_rad, isouter=True)
        .join(Sudionik, Sudionik.id_sud == Rad.id_sud, isouter=True)
        .join(Posteri, Posteri.id_poster == Rad_se_predstavlja_na.id_poster, isouter=True)
        .join(Prezentacija, Prezentacija.id_prez == Rad_se_predstavlja_na.id_prez, isouter=True)
        .filter(Rad_se_predstavlja_na.id_konf == konferencijaId)
    )

    red1 = [
        {
            'naslov': rad.naslov,
            'id': rad.id_rad,
            'autor': f"{rad.sudionik.prezime}, {rad.sudionik.ime}",
            'poster': Posteri.query.get(rad.radSePredstavljaNa[0].id_poster).poster,
            'prezentacija': Prezentacija.query.get(rad.radSePredstavljaNa[0].id_prez).prez if Prezentacija.query.get(rad.radSePredstavljaNa[0].id_prez) else None        
        }
        for rad in query1
    ]

    rez.append(red1)
    return jsonify({'rezultat': rez})

if __name__ == '__main__':
    app.run(debug=True)