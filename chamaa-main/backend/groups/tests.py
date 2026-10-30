from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import Circle, CircleMembership


User = get_user_model()


class CircleApiTests(APITestCase):
	def setUp(self):
		self.member = User.objects.create_user(
			email='member@example.com', password='Correct-horse-42!',
			phone='+254712345678',
		)
		self.staff = User.objects.create_user(
			email='staff@example.com', password='Correct-horse-42!',
			is_staff=True,
		)

	def test_regular_member_cannot_create_managed_circle(self):
		self.client.force_authenticate(user=self.member)

		response = self.client.post(
			'/api/v1/groups/circles/',
			{
				'name': 'Public Circle',
				'circle_type': 'managed',
				'plan_tier': 'starter',
				'visibility': 'public',
				'contribution_amount': 2000,
				'cadence': 'monthly',
				'max_members': 4,
			},
			format='json',
		)

		self.assertEqual(response.status_code, 400)
		self.assertEqual(Circle.objects.count(), 0)

	def test_private_three_member_circle_requires_disclaimer(self):
		self.client.force_authenticate(user=self.member)
		payload = {
			'name': 'Family Circle',
			'circle_type': 'private',
			'visibility': 'private',
			'contribution_amount': 1500,
			'cadence': 'weekly',
			'max_members': 3,
		}

		rejected = self.client.post('/api/v1/groups/circles/', payload, format='json')
		self.assertEqual(rejected.status_code, 400)

		payload['accepts_default_disclaimer'] = True
		accepted = self.client.post('/api/v1/groups/circles/', payload, format='json')

		self.assertEqual(accepted.status_code, 201)
		membership = CircleMembership.objects.get(circle_id=accepted.data['id'])
		self.assertTrue(membership.accepted_default_disclaimer)
		self.assertEqual(accepted.data['security_buffer_months'], 0)

	def test_managed_circle_activates_when_capacity_is_reached(self):
		self.client.force_authenticate(user=self.staff)
		response = self.client.post(
			'/api/v1/groups/circles/',
			{
				'name': 'Matched Circle',
				'circle_type': 'managed',
				'plan_tier': 'standard',
				'visibility': 'public',
				'contribution_amount': 5000,
				'cadence': 'monthly',
				'max_members': 4,
			},
			format='json',
		)
		self.assertEqual(response.status_code, 201)
		circle = Circle.objects.get(pk=response.data['id'])

		for index in range(4):
			user = User.objects.create_user(
				email=f'member{index}@example.com', password='Correct-horse-42!'
			)
			self.client.force_authenticate(user=user)
			join_response = self.client.post(
				f'/api/v1/groups/circles/{circle.id}/join/', {}, format='json'
			)
			self.assertEqual(join_response.status_code, 200)

		circle.refresh_from_db()
		self.assertEqual(circle.status, 'active')
		self.assertEqual(circle.memberships.filter(is_active=True).count(), 4)

	def test_admin_group_overview_requires_staff(self):
		self.client.force_authenticate(user=self.member)

		response = self.client.get('/api/v1/groups/admin/overview/')

		self.assertEqual(response.status_code, 403)

	def test_admin_group_overview_returns_database_groups(self):
		self.client.force_authenticate(user=self.staff)
		created = self.client.post(
			'/api/v1/groups/circles/',
			{
				'name': 'Premium Circle',
				'circle_type': 'managed',
				'plan_tier': 'premium',
				'visibility': 'public',
				'contribution_amount': 10000,
				'cadence': 'monthly',
				'max_members': 5,
			},
			format='json',
		)
		self.assertEqual(created.status_code, 201)

		response = self.client.get('/api/v1/groups/admin/overview/')

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data['groups'][0]['plan_tier'], 'premium')
		self.assertEqual(response.data['groups'][0]['member_count'], 0)
		self.assertTrue(any(event['kind'] == 'circle_created' for event in response.data['activity']))

	def test_member_cannot_join_managed_circle_for_another_plan(self):
		self.client.force_authenticate(user=self.staff)
		created = self.client.post(
			'/api/v1/groups/circles/',
			{
				'name': 'Starter Circle',
				'circle_type': 'managed',
				'plan_tier': 'starter',
				'visibility': 'public',
				'contribution_amount': 2000,
				'cadence': 'monthly',
				'max_members': 4,
			},
			format='json',
		)
		self.assertEqual(created.status_code, 201)
		self.member.selected_plan = 'premium'
		self.member.save(update_fields=['selected_plan'])
		self.client.force_authenticate(user=self.member)

		response = self.client.post(
			f"/api/v1/groups/circles/{created.data['id']}/join/", {}, format='json'
		)

		self.assertEqual(response.status_code, 409)
		self.assertEqual(CircleMembership.objects.filter(circle_id=created.data['id']).count(), 0)
