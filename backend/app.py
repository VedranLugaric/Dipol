import secrets
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from passlib.hash import pbkdf2_sha256

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:bazepodataka@localhost:5432/progi'
db = SQLAlchemy(app)
secret_key = secrets.token_hex(16)
app.secret_key = secret_key

def generate_session_id():
    return secrets.token_hex(16)

login_manager = LoginManager(app)
login_manager.login_view = 'login'

class Konferencija(db.Model):
    id_konf = db.Column(db.Integer, primary_key=True)
    naziv = db.Column(db.String(100))
    mjesto = db.Column(db.String(100))
    vrijeme_poc = db.Column(db.Date)
    vrijeme_zav = db.Column(db.Date)
    video = db.Column(db.String(200))

class Sudionik(db.Model):
    id_sud = db.Column(db.Integer, primary_key=True)
    ime = db.Column(db.String(50))
    prezime = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True, nullable=False)
    lozinka = db.Column(db.String(128))

    def get_id(self):
        return str(self.id_sud)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

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
    podaci = Konferencija.query.all()
    rez = [{'naziv': konf.naziv, 'mjesto': konf.mjesto} for konf in podaci]
    return jsonify({'konferencije': rez})

if __name__ == '__main__':
    app.run(debug=True)