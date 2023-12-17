import secrets
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, login_required, current_user

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:asd123@localhost:5432/progi'
db = SQLAlchemy(app)
secret_key = secrets.token_hex(16)
app.secret_key = secret_key

login_manager = LoginManager(app)
login_manager.login_view = 'login'

class Sudionik(db.Model):
    id_sud = db.Column(db.Integer, primary_key=True)
    ime = db.Column(db.String(50))
    prezime = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True, nullable=False)
    lozinka = db.Column(db.String(50))

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

        required_fields = ['ime', 'prezime', 'email', 'lozinka', 'lozinkaPotvrda']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'poruka': 'Sva polja moraju biti popunjena!'}), 400
            
        if data.get('lozinkaPotvrda') != data.get('lozinka'):
            return jsonify({'poruka': 'Lozinke se ne podudaraju!'}), 400

        novi_sudionik = Sudionik(
            ime=data['ime'],
            prezime=data['prezime'],
            email=data['email'],
            lozinka=data['lozinka']
        )

        

        db.session.add(novi_sudionik)
        db.session.commit()

        return jsonify({'poruka': 'Registracija uspješna'}), 201
    except Exception as e:
        print(f'Greška pri registraciji: {str(e)}')
        return jsonify({'poruka': 'Email se već koristi!'}), 500

@login_manager.user_loader
def load_user(user_id):
    return Sudionik.query.get(int(user_id))

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        email = data.get('email')

        korisnik = Sudionik.query.filter_by(email=email).first()

        if korisnik:
            login_user(korisnik)
            return jsonify({'poruka': 'Prijava uspješna'}), 200
        else:
            return jsonify({'poruka': 'Pogrešan e-mail'}), 401

    except Exception as e:
        app.logger.error(f'Greška pri prijavi: {str(e)}')
        return jsonify({'poruka': 'Pogreška prilikom prijave'}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    try:
        # Logout the current user
        logout_user()
        return jsonify({'poruka': 'Odjava uspješna'}), 200
    except Exception as e:
        app.logger.error(f'Greška pri odjavi: {str(e)}')
        return jsonify({'poruka': 'Pogreška prilikom odjave'}), 500

if __name__ == '__main__':
    app.run(debug=True)
