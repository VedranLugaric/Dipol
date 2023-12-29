from app import db
import secrets
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey, CheckConstraint

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
    
def generate_session_id():
    return secrets.token_hex(16)