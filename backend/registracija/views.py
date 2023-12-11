from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import RegistracijaModel
from .serializers import RegistracijaModelSerializer

# Create your views here.
class RegistracijaApiView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegistracijaModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Data received successfully'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)