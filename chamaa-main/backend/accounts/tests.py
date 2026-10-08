from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APITestCase


User = get_user_model()


class UserManagerTests(APITestCase):
    def test_user_can_be_created_without_a_password_for_future_otp_auth(self):
        user = User.objects.create_user(phone='+254712345678')

        self.assertEqual(user.phone, '+254712345678')
        self.assertFalse(user.has_usable_password())

    def test_phone_is_required(self):
        with self.assertRaisesMessage(ValueError, 'A phone number is required.'):
            User.objects.create_user(phone=' ')


class CurrentUserApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            phone='+254712345678',
            name='Amina Example',
            email='amina@example.com',
        )

    def test_profile_requires_authentication(self):
        response = self.client.get('/api/v1/accounts/me/')

        self.assertIn(response.status_code, (401, 403))

    def test_authenticated_user_can_read_and_update_own_profile(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get('/api/v1/accounts/me/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['phone'], self.user.phone)

        response = self.client.patch(
            '/api/v1/accounts/me/',
            {'name': 'Amina Wanjiku', 'phone': '+254700000000'},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'Amina Wanjiku')
        self.assertEqual(response.data['phone'], self.user.phone)


@override_settings(DEBUG=True)
class OtpAuthenticationApiTests(APITestCase):
    def setUp(self):
        cache.clear()

    def tearDown(self):
        cache.clear()

    def test_otp_verification_creates_token_and_account(self):
        request_response = self.client.post(
            '/api/v1/accounts/otp/request/',
            {'phone': '0712 345 678'},
            format='json',
        )
        self.assertEqual(request_response.status_code, 200)

        verify_response = self.client.post(
            '/api/v1/accounts/otp/verify/',
            {'phone': '0712 345 678', 'code': request_response.data['debug_code']},
            format='json',
        )
        self.assertEqual(verify_response.status_code, 200)
        self.assertEqual(verify_response.data['user']['phone'], '+254712345678')

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {verify_response.data['token']}"
        )
        profile_response = self.client.get('/api/v1/accounts/me/')
        self.assertEqual(profile_response.status_code, 200)
        self.assertEqual(profile_response.data['phone'], '+254712345678')

    def test_otp_request_is_disabled_outside_debug(self):
        with override_settings(DEBUG=False):
            response = self.client.post(
                '/api/v1/accounts/otp/request/',
                {'phone': '+254712345678'},
                format='json',
            )

        self.assertEqual(response.status_code, 503)