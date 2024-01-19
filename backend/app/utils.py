from google.cloud import storage, secretmanager
from app import db, app
from app.models import Rad, Sudionik, Konferencija
import os
import uuid
from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy import desc, func
import logging
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from apscheduler.triggers.interval import IntervalTrigger

scheduler = BackgroundScheduler()
logging.getLogger('apscheduler').setLevel(logging.ERROR)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'progidipol@gmail.com'
app.config['MAIL_PASSWORD'] = 'goad jyux xwvs tadx'
mail = Mail(app)

def generate_token():
    return str(uuid.uuid4())

def send_verification_email(email, token):
    msg = Message('Verify Your Email Address', sender='progidipol@gmail.com', recipients=[email])
    msg.body = f'Please verify your email address by clicking on the following link: https://dripol.onrender.com/verify/{token}'
    mail.send(msg)

def generate_unique_filename(filename):
    filename = secure_filename(filename)
    unique_id = str(uuid.uuid4().hex)
    _, file_extension = os.path.splitext(filename)
    unique_filename = f"{unique_id}{file_extension}"
    return unique_filename

def upload_to_gcs(file, bucket_name, destination_blob_name):
    key_file_path = "D:\\PROJEKT_PROGI\\progi-key.json"
    client = storage.Client.from_service_account_json(key_file_path)
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    content_type = 'application/octet-stream'

    if '.' in file.filename:
        extension = file.filename.rsplit('.', 1)[1].lower()
    if extension in ['jpg', 'jpeg']:
        content_type = 'image/jpeg'
    elif extension == 'png':
        content_type = 'image/png'
    elif extension == 'pdf':
        content_type = 'application/pdf'
    elif extension in ['ppt', 'pptx']:
        content_type = 'application/vnd.ms-powerpoint'

    blob.upload_from_file(file, content_type=content_type)

def save_to_database(naslov_rad, image_link, pdf_link, ppt_link, conference_id, user_id):
    if naslov_rad is None or naslov_rad.strip() == "":
        raise ValueError("Invalid title provided")

    new_rad = Rad(naslov=naslov_rad, id_sud=user_id, poster=image_link, pdf=pdf_link, id_konf=conference_id, odobren=False)

    if ppt_link:
        new_rad.prez = ppt_link

    db.session.add(new_rad)

    db.session.commit()


def send_email_to_top_poster_users(conference_id):
    with app.app_context():
        top_users = db.session.query(Sudionik.email).join(Rad).filter(
            Rad.id_konf == conference_id).group_by(Sudionik.email).order_by(
            func.sum(Rad.br_glasova).desc()).limit(3).all()

        msg = Message(
            "Čestitamo!",
            sender="progidipol@gmail.com",
            recipients=[user[0] for user in top_users]
        )
        msg.body = msg.body = f"""Poštovani,

Čestitamo vam na iznimnom uspjehu na nedavnoj konferenciji, gdje ste se istaknuli kao jedan od 3 najbolja sudionika. Želimo vas obavijestiti o dodjeli nagrade i detaljima ceremonije.

Ceremonija će uključivati kratku prezentaciju vašeg rada, prigodne govore i naravno, dodjelu nagrada. Vaš izniman doprinos konferenciji zaslužuje posebno priznanje, stoga se nadamo da ćete se pridružiti kako biste primili svoju nagradu i podijelili iskustva s ostalim sudionicima.

Molimo vas da potvrdite svoje sudjelovanje na ceremoniji, kako bismo pravilno organizirali događaj i osigurali vašu prisutnost.

Ukoliko imate bilo kakvih pitanja ili posebnih zahtjeva, slobodno nas kontaktirajte. Još jednom, čestitamo vam na iznimnom uspjehu i radujemo se vašem prisustvu na dodjeli nagrada.

S poštovanjem,
Dipol"""

        mail.send(msg)
        print('Emails sent')

def cleanup():
    try:
        now = datetime.utcnow()

        unverified_users = Sudionik.query.filter_by(verified=False).all()

        for user in unverified_users:
            if now - user.token_vrijeme > timedelta(minutes=10):
                db.session.delete(user)

        db.session.commit()

        print('Cleanup successful')
    except Exception as e:
        print(f'Error during cleanup: {str(e)}')


with app.app_context():
    conferences = Konferencija.query.all()

    for conference in conferences:
        scheduler.add_job(func=send_email_to_top_poster_users, trigger='date', run_date=conference.vrijeme_zav, args=[conference.id_konf])

    scheduler.add_job(func=cleanup, trigger=IntervalTrigger(hours=1))

    scheduler.start()