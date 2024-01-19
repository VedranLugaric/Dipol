from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_principal import Principal, Permission, RoleNeed
import secrets

app = Flask(__name__)

CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://progi_sri5_user:hNJWJVFATKEEgTnmHNMumHxFYn7mvXPl@dpg-cmfajrf109ks73cf01q0-a.frankfurt-postgres.render.com/progi_sri5'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
principal = Principal(app)

secret_key = secrets.token_hex(16)
app.secret_key = secret_key

admin_permission = Permission(RoleNeed('admin'))
author_permission = Permission(RoleNeed('author'))
user_permission = Permission(RoleNeed('user'))
superadmin_permission = Permission(RoleNeed('superadmin'))

from app import routes
