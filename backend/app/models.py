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
    
def generate_session_id():
    return secrets.token_hex(16)