from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_principal import Principal, Permission, RoleNeed
import secrets

app = Flask(__name__)

CORS(app, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:bazepodataka@localhost:5432/progi'
db = SQLAlchemy(app)
principal = Principal(app)

secret_key = secrets.token_hex(16)
app.secret_key = secret_key
from app import routes  # Import routes after initializing app and extensions
