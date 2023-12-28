from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
import secrets

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:asd123@localhost:5432/progi'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
secret_key = secrets.token_hex(16)
app.secret_key = secret_key
from app import routes
