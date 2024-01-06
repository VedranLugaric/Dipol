from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_principal import Principal, Permission, RoleNeed
import secrets

app = Flask(__name__)

CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:asd123@localhost:5432/progi1'
db = SQLAlchemy(app)
principal = Principal(app)

secret_key = secrets.token_hex(16)
app.secret_key = secret_key

admin_permission = Permission(RoleNeed('admin'))
author_permission = Permission(RoleNeed('author'))
user_permission = Permission(RoleNeed('user'))
superadmin_permission = Permission(RoleNeed('superadmin'))

from app import routes
