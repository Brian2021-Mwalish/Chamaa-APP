from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import KYCSubmission


User = get_user_model()


class UserManagerTests(APITestCase):
    def test_user_can_be_created_with_email_and_password(self):
        user = User.objects.create_user(
            email='amina@example.com', password='Correct-horse-42!'
        )

        self.assertEqual(user.email, 'amina@example.com')
        self.assertTrue(user.check_password('Correct-horse-42!'))

    def test_email_is_required(self):
        with self.assertRaisesMessage(ValueError, 'An email address is required.'):
            User.objects.create_user(email=' ')


class CurrentUserApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='amina@example.com',
            password='Correct-horse-42!',
            phone='+254712345678',
            name='Amina Example',
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

    def test_membership_demo_can_advance_to_group_matching(self):
        self.user.onboarding_stage = 'membership'
        self.user.save(update_fields=['onboarding_stage'])
        self.client.force_authenticate(user=self.user)

        response = self.client.post('/api/v1/accounts/onboarding/advance/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['onboarding_stage'], 'waiting')


class SignupApiTests(APITestCase):
    def test_signup_creates_account_and_session(self):
        response = self.client.post(
            '/api/v1/accounts/signup/',
            {
                'name': 'Amina Example',
                'email': 'amina@example.com',
                'password': 'Correct-horse-42!',
                'phone': '+254712345678',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['user']['email'], 'amina@example.com')
        self.assertEqual(response.data['user']['phone'], '+254712345678')
        self.assertEqual(response.data['user']['onboarding_stage'], 'kyc')
        self.assertFalse(response.data['user']['phone_verified'])
        self.assertTrue(response.data['token'])
        user = User.objects.get(email='amina@example.com')
        self.assertEqual(user.email, 'amina@example.com')
        self.assertTrue(user.check_password('Correct-horse-42!'))

    def test_signup_requires_email(self):
        response = self.client.post(
            '/api/v1/accounts/signup/',
            {'name': 'Amina Example', 'password': 'Correct-horse-42!'},
            format='json',
        )

        self.assertEqual(response.status_code, 400)


class PasswordAuthenticationApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='amina@example.com', password='Correct-horse-42!', name='Amina Example'
        )

    def test_login_returns_token_and_profile(self):
        response = self.client.post(
            '/api/v1/accounts/login/',
            {'email': 'AMINA@example.com', 'password': 'Correct-horse-42!'},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['token'])
        self.assertEqual(response.data['user']['email'], 'amina@example.com')

    def test_login_rejects_incorrect_password(self):
        response = self.client.post(
            '/api/v1/accounts/login/',
            {'email': 'amina@example.com', 'password': 'wrong-password'},
            format='json',
        )

        self.assertEqual(response.status_code, 400)

    def test_superuser_login_is_marked_for_admin_dashboard(self):
        User.objects.create_superuser(
            email='admin@example.com', password='Correct-horse-42!'
        )

        response = self.client.post(
            '/api/v1/accounts/login/',
            {'email': 'admin@example.com', 'password': 'Correct-horse-42!'},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['user']['is_admin'])


class AdminUsersApiTests(APITestCase):
    def setUp(self):
        self.member = User.objects.create_user(
            email='member@example.com', password='Correct-horse-42!',
            name='Member Example', phone='+254712345678',
        )

    def test_user_list_requires_admin_access(self):
        self.client.force_authenticate(user=self.member)

        response = self.client.get('/api/v1/accounts/admin/users/')

        self.assertEqual(response.status_code, 403)

    def test_member_cannot_fetch_private_kyc_document(self):
        self.client.force_authenticate(user=self.member)

        response = self.client.get(
            f'/api/v1/accounts/admin/users/{self.member.id}/kyc/documents/id/'
        )

        self.assertEqual(response.status_code, 403)

    def test_admin_can_fetch_database_accounts(self):
        admin_user = User.objects.create_superuser(
            email='admin@example.com', password='Correct-horse-42!'
        )
        self.client.force_authenticate(user=admin_user)

        response = self.client.get('/api/v1/accounts/admin/users/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        member_data = next(
            account for account in response.data
            if account['email'] == 'member@example.com'
        )
        self.assertEqual(member_data['name'], 'Member Example')
        self.assertEqual(member_data['phone'], '+254712345678')
        self.assertEqual(member_data['kyc_status'], 'not_submitted')

    def test_admin_user_list_includes_submitted_onboarding_details(self):
        KYCSubmission.objects.create(
            user=self.member,
            full_name='Member Legal Name',
            id_document='kyc/member/id.png',
            income_document='kyc/member/income.pdf',
        )
        admin_user = User.objects.create_superuser(
            email='admin@example.com', password='Correct-horse-42!'
        )
        self.client.force_authenticate(user=admin_user)

        response = self.client.get('/api/v1/accounts/admin/users/')
        member_data = next(
            account for account in response.data
            if account['email'] == 'member@example.com'
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(member_data['kyc_full_name'], 'Member Legal Name')
        self.assertEqual(member_data['kyc_status'], 'pending')
        self.assertTrue(member_data['id_document_uploaded'])
        self.assertTrue(member_data['income_document_uploaded'])

    def test_admin_can_persist_kyc_approval(self):
        KYCSubmission.objects.create(
            user=self.member,
            full_name='Member Legal Name',
            id_document='kyc/member/id.png',
            income_document='kyc/member/income.pdf',
        )
        admin_user = User.objects.create_superuser(
            email='admin@example.com', password='Correct-horse-42!'
        )
        self.client.force_authenticate(user=admin_user)

        response = self.client.patch(
            f'/api/v1/accounts/admin/users/{self.member.id}/kyc/',
            {'status': 'approved'},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['kyc_status'], 'approved')
        self.member.kyc_submission.refresh_from_db()
        self.assertEqual(self.member.kyc_submission.status, 'approved')

    def test_admin_can_block_and_restore_member_access(self):
        admin_user = User.objects.create_superuser(
            email='admin@example.com', password='Correct-horse-42!'
        )
        token = Token.objects.create(user=self.member)
        self.client.force_authenticate(user=admin_user)

        response = self.client.patch(
            f'/api/v1/accounts/admin/users/{self.member.id}/status/',
            {'is_active': False},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data['is_active'])
        self.assertFalse(Token.objects.filter(pk=token.pk).exists())
        self.member.refresh_from_db()
        self.assertFalse(self.member.is_active)

        response = self.client.patch(
            f'/api/v1/accounts/admin/users/{self.member.id}/status/',
            {'is_active': True},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_active'])
        self.member.refresh_from_db()
        self.assertTrue(self.member.is_active)