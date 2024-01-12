from google.cloud import storage, secretmanager
from app import db, app
from app.models import Rad, Sudionik, Konferencija
import os
import uuid
from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy import desc, func
import logging

def generate_unique_filename(filename):
    unique_id = str(uuid.uuid4().hex)
    
    _, file_extension = os.path.splitext(filename)

    unique_filename = f"{unique_id}{file_extension}"

    return unique_filename

def upload_to_gcs(file, bucket_name, destination_blob_name):
    key_file_path = "C:\\Users\\Lukas\\Desktop\\FER\\progi-key.json"
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

scheduler = BackgroundScheduler()
logging.getLogger('apscheduler').setLevel(logging.ERROR)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'progidipol@gmail.com'
app.config['MAIL_PASSWORD'] = 'goad jyux xwvs tadx'
mail = Mail(app)

def send_email_to_top_poster_users(conference_id):
    with app.app_context():
        # SQLAlchemy query to get top 3 users
        top_users = db.session.query(Sudionik.email).join(Rad).filter(
            Rad.id_konf == conference_id).group_by(Sudionik.email).order_by(
            func.sum(Rad.br_glasova).desc()).limit(3).all()


        # Prepare email
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

        # Send email
        mail.send(msg)
        print('Emails sent')


with app.app_context():
    # Get all conferences
    conferences = Konferencija.query.all()

    # Schedule the function to run at each conference end time
    for conference in conferences:
        scheduler.add_job(func=send_email_to_top_poster_users, trigger='date', run_date=conference.vrijeme_zav, args=[conference.id_konf])

    # Start the scheduler
    scheduler.start()