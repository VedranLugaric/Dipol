from django.urls import path
from .views import RegistracijaApiView#, CustomTokenObtainPairView

urlpatterns = [
    path('registracija/', RegistracijaApiView.as_view(), name='registracija'),
    #path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]