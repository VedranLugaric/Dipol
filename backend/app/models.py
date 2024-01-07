from app import db
import secrets
from flask_principal import RoleNeed, UserNeed

class sudionik_roles(db.Model):
    sudionik_id = db.Column(db.Integer, db.ForeignKey('sudionik.id_sud'), primary_key=True)
    role_id = db.Column(db.Integer(), db.ForeignKey('roles.id'), primary_key=True)

class Roles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

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
    role = db.relationship('Roles', secondary='sudionik_roles', backref=db.backref('sudionici', lazy='dynamic'))

    def get_id(self):
        return str(self.id_sud)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True
    
    def has_role(self, role_name):
        return self.role.name == role_name
    
class Rad(db.Model):
    __tablename__ = 'rad'

    id_rad = db.Column(db.Integer, primary_key=True)
    naslov = db.Column(db.String(100))
    id_sud = db.Column(db.Integer, db.ForeignKey('sudionik.id_sud'))

    sudionik = db.relationship('Sudionik')
    rad_se_predstavlja_na = db.relationship('Rad_se_predstavlja_na', back_populates='rad')


class Prezentacija(db.Model):
    __tablename__ = 'prezentacija'

    id_prez = db.Column(db.Integer, primary_key=True)
    prez = db.Column(db.String(200))

class Rad_se_predstavlja_na(db.Model):
    __tablename__ = 'rad_se_predstavlja_na'

    id_poster = db.Column(db.Integer, db.ForeignKey('posteri.id_poster'), primary_key=True)
    id_prez = db.Column(db.Integer, db.ForeignKey('prezentacija.id_prez'), primary_key=False)
    id_rad = db.Column(db.Integer, db.ForeignKey('rad.id_rad'), primary_key=True)
    id_konf = db.Column(db.Integer, db.ForeignKey('konferencija.id_konf'), primary_key=True)
    br_glasova = db.Column(db.Integer, default=0)

    posteri = db.relationship('Posteri', back_populates='rad_se_predstavlja_na')
    prezentacija = db.relationship('Prezentacija')
    rad = db.relationship('Rad', back_populates='rad_se_predstavlja_na')
    konferencija = db.relationship('Konferencija')

    def __init__(self, id_poster, id_prez, id_rad, id_konf):
        self.id_poster = id_poster
        self.id_prez = id_prez
        self.id_rad = id_rad
        self.id_konf = id_konf

class Posteri(db.Model):
    __tablename__ = 'posteri'

    id_poster = db.Column(db.Integer, primary_key=True)
    poster = db.Column(db.String(200))

    rad_se_predstavlja_na = db.relationship('Rad_se_predstavlja_na', back_populates='posteri', foreign_keys=[Rad_se_predstavlja_na.id_poster])

class Sudionik_sudjeluje_na(db.Model):
    __tablename__ = 'sudionik_sudjeluje_na'

    glasovao = db.Column(db.Integer, db.CheckConstraint('Glasovao IN (0, 1)'), default=0)

    id_konf = db.Column(db.Integer, db.ForeignKey('konferencija.id_konf'), primary_key=True)
    konferencija = db.relationship('Konferencija')

    id_sud = db.Column(db.Integer, db.ForeignKey('sudionik.id_sud'), primary_key=True)
    sudionik = db.relationship('Sudionik')

class Sudionik_je_administrator(db.Model):
    __tablename__ = 'sudionik_je_administrator'

    id_konf = db.Column(db.Integer, db.ForeignKey('konferencija.id_konf'), primary_key=True)
    konferencija = db.relationship('Konferencija')
    
    id_sud = db.Column(db.Integer, db.ForeignKey('sudionik.id_sud'), primary_key=True)
    sudionik = db.relationship('Sudionik')

class Superadmin(db.Model):
    __tablename__ = 'superadmin'
    
    id_sud = db.Column(db.Integer, db.ForeignKey('sudionik.id_sud'), primary_key=True)
    sudionik = db.relationship('Sudionik')
    
def generate_session_id():
    return secrets.token_hex(16)