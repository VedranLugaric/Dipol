from django.urls import path
from .views import RegistracijaApiView

urlpatterns = [
    path('registracija/', RegistracijaApiView.as_view(), name='registracija'),
]