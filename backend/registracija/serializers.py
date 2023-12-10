from rest_framework import serializers
from . import models

class RegistracijaModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RegistracijaModel
        fields = '__all__'