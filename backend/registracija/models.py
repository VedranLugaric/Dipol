from django.db import models

# Create your models here.
class RegistracijaModel(models.Model):
    ime = models.CharField(max_length=255)
    prezime = models.CharField(max_length=255)
    korisnicko_ime = models.CharField(max_length=255)
    lozinka = models.CharField(max_length=255)