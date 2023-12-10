from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

# Create your tests here.
class RegistracijaApiViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        def test_post_data_to_api_endpoint(self):
            url = reverse('registracija-api-endpoint')
            data_to_send = {'ime': 'imenkovic', 'prezime': 'prezimenkovic', 'korisnicko_ime': 'k_ime', 'lozinka': 'loz123'}

            response = self.client.post(url, data_to_send, format='json')

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['received_data'], data_to_send)