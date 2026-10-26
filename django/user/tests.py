import json

from django.contrib.auth import get_user_model
from django.test import TestCase


class AuthApiTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='rahim123',
            password='secret123',
            first_name='Abdur',
            last_name='Rahim',
        )

    def test_login_returns_expected_user_and_tokens(self):
        response = self.client.post(
            '/auth/login/',
            data=json.dumps({'username': 'rahim123', 'password': 'secret123'}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['full_name'], 'Abdur Rahim')
        self.assertEqual(response.json()['username'], 'rahim123')
        self.assertTrue(response.json()['access'])
        self.assertTrue(response.json()['refresh'])

    def test_invalid_login_response(self):
        response = self.client.post(
            '/auth/login/',
            data=json.dumps({'username': 'rahim123', 'password': 'wrong'}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(),
            {'detail': 'Invalid username or password.'},
        )

    def test_invalid_refresh_token_response(self):
        response = self.client.post(
            '/auth/token/refresh/',
            data=json.dumps({'refresh': '..!'}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(),
            {'detail': 'Token is invalid or expired.'},
        )

    def test_refresh_rotates_token_and_rejects_reuse(self):
        login_response = self.client.post(
            '/auth/login/',
            data=json.dumps({'username': 'rahim123', 'password': 'secret123'}),
            content_type='application/json',
        )
        refresh = login_response.json()['refresh']

        response = self.client.post(
            '/auth/token/refresh/',
            data=json.dumps({'refresh': refresh}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['access'])
        self.assertNotEqual(response.json()['refresh'], refresh)

        response = self.client.post(
            '/auth/token/refresh/',
            data=json.dumps({'refresh': refresh}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(),
            {'detail': 'Token is invalid or expired.'},
        )

    def test_logout_revokes_refresh_token(self):
        login_response = self.client.post(
            '/auth/login/',
            data=json.dumps({'username': 'rahim123', 'password': 'secret123'}),
            content_type='application/json',
        )
        refresh = login_response.json()['refresh']

        response = self.client.post(
            '/auth/logout/',
            data=json.dumps({'refresh': refresh}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 205)
        self.assertEqual(response.json(), {'detail': 'Logged out successfully.'})

        response = self.client.post(
            '/auth/token/refresh/',
            data=json.dumps({'refresh': refresh}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 401)
