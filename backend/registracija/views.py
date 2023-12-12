from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import RegistracijaModel
from .serializers import RegistracijaModelSerializer
#from rest_framework_simplejwt.tokens import RefreshToken
#from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.
class RegistracijaApiView(APIView):
    def post(self, request, *args, **kwargs):

        #provjera ako korisnicko ime vec postoji
        username = request.data.get('username', None)
        if RegistracijaModel.objects.filter(username=username).exists():
            return Response({'message': 'Korisničko ime već postoji!'}, status=status.HTTP_400_BAD_REQUEST)


        #ako vec ne postoji onda spremi sve podatke registracije
        serializer = RegistracijaModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Uspješna registracija'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

#class CustomTokenObtainPairView(TokenObtainPairView):
#    serializer_class = RegistracijaModelSerializer