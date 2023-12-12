from django.db import models

# Create your models here.
class RegistracijaModel(models.Model):
    ime = models.CharField(max_length=255)
    prezime = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.ime