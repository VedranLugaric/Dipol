import secrets
from flask_bcrypt import Bcrypt
import jwt
from flask import Flask, request, jsonify, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask import redirect, make_response


app = Flask(__name__)
CORS(app, supports_credentials=True, allow_redirects=True, origins=["http://localhost:5173/"])
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:asd123@localhost:5432/progi'
app.config['CORS_HEADERS'] = 'Content-Type'
db = SQLAlchemy(app)
secret_key = secrets.token_hex(16)
app.secret_key = secret_key
bcrypt = Bcrypt(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'

class Sudionik(db.Model):
    id_sud = db.Column(db.Integer, primary_key=True)
    ime = db.Column(db.String(50))
    prezime = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True, nullable=False)
    lozinka = db.Column(db.String(50))

    def set_password(self, raw_password):
        self.lozinka = bcrypt.generate_password_hash(raw_password).decode('utf-8')

        

    def check_password(self, raw_password):
        return bcrypt.check_password_hash(self.lozinka, raw_password)


    def get_id(self):
        return str(self.id_sud)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

@app.route('/api/registracija/', methods=['POST'])
@cross_origin()
def registracija():
    try:

        if request.method == 'OPTIONS':
            # Handle CORS preflight request
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type")
            return response
        
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
        )

        novi_sudionik.set_password(data['lozinka'])

        

        db.session.add(novi_sudionik)
        db.session.commit()


        return redirect('http://localhost:5173/login')

        #return jsonify({'poruka': 'Registracija uspješna'}), 201
    except Exception as e:
        print(f'Greška pri registraciji: {str(e)}')
        return jsonify({'poruka': 'Email se već koristi!'}), 500

@app.route('/api/login/', methods=['POST', 'OPTIONS'])
@cross_origin()
def login():
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response
    
    try:
        data = request.get_json()

        email = data.get('email')
        password = data.get('lozinka')

        korisnik = Sudionik.query.filter_by(email=email).first()

        if korisnik and korisnik.check_password(password):
            login_user(korisnik)
            token = jwt.encode({'user_id': korisnik.id_sud}, app.config['SECRET_KEY'], algorithm='HS256')

            response = make_response(jsonify({'poruka': 'Prijava uspješna'}), 200)
            response.set_cookie('token', token, httponly=True, secure=False)
            
            return response
        else:
            return jsonify({'poruka': 'Pogrešan email ili lozinka'}), 401

    except Exception as e:
        app.logger.error({f'Greška pri prijavi: {str(e)}'})
        return jsonify({'poruka': 'Pogreška prilikom prijave'}), 500
    

if __name__ == '__main__':
    app.run(debug=True)
