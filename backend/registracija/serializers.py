from rest_framework import serializers
from .models import RegistracijaModel

class RegistracijaModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistracijaModel
        fields = ['ime', 'prezime', 'username', 'password']