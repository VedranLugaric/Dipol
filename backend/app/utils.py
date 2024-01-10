from google.cloud import storage
from app import db
from app.models import Posteri, Rad, Rad_se_predstavlja_na
import os
import uuid

def generate_unique_filename(filename):
    unique_id = str(uuid.uuid4().hex)
    
    _, file_extension = os.path.splitext(filename)

    unique_filename = f"{unique_id}{file_extension}"

    return unique_filename

def upload_to_gcs(file, bucket_name, destination_blob_name):
    key_file_path = "D:\\FER\\5. Semestar\\Programsko_inzenjerstvo\\Projekt\\Git\\Dipol\\progi-key.json"
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

    blob.upload_from_file(file, content_type=content_type)

def save_to_database(naslov_rad, image_link, conference_id, user_id):

    if naslov_rad is None or naslov_rad.strip() == "":
        raise ValueError("Invalid title provided")

    new_poster = Posteri(poster=image_link)

    new_rad = Rad(naslov=naslov_rad, id_sud=user_id)

    db.session.add(new_poster)
    db.session.add(new_rad)

    db.session.commit()

    id_poster = new_poster.id_poster
    id_rad = new_rad.id_rad

    new_poster_entry = Rad_se_predstavlja_na(
        id_poster=id_poster,
        id_prez=None,
        id_rad=id_rad,
        id_konf=conference_id,
    )

    db.session.add(new_poster_entry)

    db.session.commit()