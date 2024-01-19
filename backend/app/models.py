from app import db
import secrets
from flask_principal import RoleNeed, UserNeed
from datetime import datetime
class Uloge(db.Model):
    id_uloge = db.Column(db.Integer, primary_key=True)
    naziv = db.Column(db.String(50), unique=True, nullable=False)

class Konferencija(db.Model):
    id_konf = db.Column(db.Integer, primary_key=True)
    naziv = db.Column(db.String(100))
    mjesto = db.Column(db.String(100))
    vrijeme_poc = db.Column(db.TIMESTAMP(timezone = True))
    vrijeme_zav = db.Column(db.TIMESTAMP(timezone = True))
    video = db.Column(db.String(200))
    opis = db.Column(db.String(1000))
    lozinka = db.Column(db.String(100))
    aktivna = db.Column(db.Boolean, default=False)

class Sudionik(db.Model):
    id_sud = db.Column(db.Integer, primary_key=True)
    ime = db.Column(db.String(50))
    prezime = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True, nullable=False)
    lozinka = db.Column(db.String(128))
    admin = db.Column(db.Boolean)
    token = db.Column(db.String(255), unique=True)
    token_vrijeme = db.Column(db.DateTime, default=datetime.utcnow)
    verified = db.Column(db.Boolean, default=False)

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
    id_sud = db.Column(db.Integer, db.ForeignKey('sudionik.id_sud'))
    pdf = db.Column(db.String(200))
    poster = db.Column(db.String(200))
    prez = db.Column(db.String(200))
    odobren = db.Column(db.Boolean)
    br_glasova = db.Column(db.Integer, default=0)
    id_konf = db.Column(db.Integer, db.ForeignKey('konferencija.id_konf'))
    
    sudionik = db.relationship('Sudionik')
    konferencija = db.relationship('Konferencija')

class Sudionik_sudjeluje_na(db.Model):
    __tablename__ = 'sudionik_sudjeluje_na'

    glasovao = db.Column(db.Integer, db.CheckConstraint('Glasovao IN (0, 1)'), default=0)

    id_konf = db.Column(db.Integer, db.ForeignKey('konferencija.id_konf'), primary_key=True)
    konferencija = db.relationship('Konferencija')

    id_sud = db.Column(db.Integer, db.ForeignKey('sudionik.id_sud'), primary_key=True)
    sudionik = db.relationship('Sudionik')

    id_uloge = db.Column(db.Integer, db.ForeignKey('uloge.id_uloge'), primary_key=True)
    uloge = db.relationship('Uloge')

class Pokrovitelj(db.Model):
    __tablename__ = 'pokrovitelj' 

    id_pokrovitelj = db.Column(db.Integer, primary_key = True)
    ime = db.Column(db.String(100))
    stranica = db.Column(db.String(200))
    logo = db.Column(db.String(200))

class Pokrovitelj_sponzorira(db.Model):
    __tablename__ = 'pokrovitelj_sponzorira'  

    id_pokrovitelj = db.Column(db.Integer, db.ForeignKey('pokrovitelj.id_pokrovitelj'), primary_key = True)
    id_konf = db.Column(db.Integer, db.ForeignKey('konferencija.id_konf'), primary_key = True)
    pokrovitelj = db.relationship('Pokrovitelj')
    konferencija = db.relationship('Konferencija') 

class Galerija(db.Model):
    __tablename__ = 'galerija'

    id_slika = db.Column(db.Integer, primary_key=True)
    slika_link = db.Column(db.String(200), nullable=False)
    id_konf = db.Column(db.Integer, db.ForeignKey('konferencija.id_konf'))

    konferencija = db.relationship('Konferencija')

def generate_session_id():
    return secrets.token_hex(16)