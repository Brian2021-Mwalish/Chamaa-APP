from django.conf import settings
from django.db import models
from django.utils import timezone


class Circle(models.Model):
	PLAN_CHOICES = (
		('starter', 'Starter'),
		('standard', 'Standard'),
		('premium', 'Premium'),
	)
	TYPE_CHOICES = (
		('managed', 'Platform managed'),
		('private', 'Friends and family'),
	)
	VISIBILITY_CHOICES = (
		('public', 'Public'),
		('private', 'Private'),
	)
	CADENCE_CHOICES = (
		('weekly', 'Weekly'),
		('monthly', 'Monthly'),
	)
	STATUS_CHOICES = (
		('forming', 'Forming'),
		('active', 'Active'),
		('completed', 'Completed'),
		('paused', 'Paused'),
	)

	name = models.CharField(max_length=100)
	circle_type = models.CharField(max_length=12, choices=TYPE_CHOICES)
	plan_tier = models.CharField(max_length=20, choices=PLAN_CHOICES, blank=True, default='')
	visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES)
	created_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.SET_NULL,
		null=True,
		related_name='created_circles',
	)
	contribution_amount = models.PositiveIntegerField()
	cadence = models.CharField(max_length=8, choices=CADENCE_CHOICES, default='monthly')
	max_members = models.PositiveSmallIntegerField(default=5)
	membership_fee_percent = models.DecimalField(
		max_digits=4, decimal_places=2, default=1.00
	)
	security_buffer_months = models.PositiveSmallIntegerField(default=1)
	status = models.CharField(max_length=12, choices=STATUS_CHOICES, default='forming')
	created_at = models.DateTimeField(default=timezone.now)

	class Meta:
		db_table = 'accounts_circle'
		ordering = ('-created_at',)

	def __str__(self):
		return self.name


class CircleMembership(models.Model):
	circle = models.ForeignKey(Circle, on_delete=models.CASCADE, related_name='memberships')
	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='circle_memberships',
	)
	rotation_order = models.PositiveSmallIntegerField(null=True, blank=True)
	auto_debit_opt_in = models.BooleanField(default=False)
	accepted_default_disclaimer = models.BooleanField(default=False)
	is_active = models.BooleanField(default=True)
	joined_at = models.DateTimeField(default=timezone.now)

	class Meta:
		db_table = 'accounts_circlemembership'
		ordering = ('rotation_order', 'joined_at')
		constraints = [
			models.UniqueConstraint(fields=('circle', 'user'), name='unique_circle_member'),
		]


class Contribution(models.Model):
	STATUS_CHOICES = (
		('pending', 'Pending'),
		('paid', 'Paid'),
		('missed', 'Missed'),
	)
	PAYMENT_METHOD_CHOICES = (
		('manual', 'Manual'),
		('direct_debit', 'Direct debit'),
	)

	membership = models.ForeignKey(
		CircleMembership, on_delete=models.CASCADE, related_name='contributions'
	)
	cycle_number = models.PositiveIntegerField()
	amount = models.PositiveIntegerField()
	status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
	payment_method = models.CharField(
		max_length=12, choices=PAYMENT_METHOD_CHOICES, default='manual'
	)
	payment_reference = models.CharField(max_length=100, blank=True)
	created_at = models.DateTimeField(default=timezone.now)
	paid_at = models.DateTimeField(null=True, blank=True)

	class Meta:
		db_table = 'accounts_contribution'
		ordering = ('-created_at',)
		constraints = [
			models.UniqueConstraint(
				fields=('membership', 'cycle_number'), name='unique_member_cycle_contribution'
			),
		]


class Payout(models.Model):
	STATUS_CHOICES = (
		('queued', 'Queued'),
		('processing', 'Processing'),
		('paid', 'Paid'),
	)

	circle = models.ForeignKey(Circle, on_delete=models.CASCADE, related_name='payouts')
	recipient = models.ForeignKey(
		CircleMembership, on_delete=models.PROTECT, related_name='payouts'
	)
	cycle_number = models.PositiveIntegerField()
	gross_amount = models.PositiveIntegerField()
	membership_fee_amount = models.PositiveIntegerField(default=0)
	security_buffer_amount = models.PositiveIntegerField(default=0)
	status = models.CharField(max_length=12, choices=STATUS_CHOICES, default='queued')
	buffer_released_at = models.DateTimeField(null=True, blank=True)
	created_at = models.DateTimeField(default=timezone.now)
	paid_at = models.DateTimeField(null=True, blank=True)

	class Meta:
		db_table = 'accounts_payout'
		ordering = ('cycle_number',)
		constraints = [
			models.UniqueConstraint(fields=('circle', 'cycle_number'), name='unique_circle_cycle_payout'),
		]


class Donation(models.Model):
	STATUS_CHOICES = (
		('pending', 'Pending'),
		('confirmed', 'Confirmed'),
	)

	donor = models.ForeignKey(
		settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='donations'
	)
	amount = models.PositiveIntegerField()
	status = models.CharField(max_length=12, choices=STATUS_CHOICES, default='pending')
	created_at = models.DateTimeField(default=timezone.now)
	confirmed_at = models.DateTimeField(null=True, blank=True)

	class Meta:
		db_table = 'accounts_donation'


class FoundationNomination(models.Model):
	KIND_CHOICES = (
		('individual', 'Individual'),
		('cause', 'Cause'),
	)
	STATUS_CHOICES = (
		('pending', 'Pending review'),
		('reviewing', 'Under review'),
		('selected', 'Selected'),
		('declined', 'Declined'),
	)

	nominated_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='foundation_nominations',
	)
	kind = models.CharField(max_length=12, choices=KIND_CHOICES)
	title = models.CharField(max_length=150)
	description = models.TextField(max_length=2000)
	location = models.CharField(max_length=120, blank=True)
	status = models.CharField(max_length=12, choices=STATUS_CHOICES, default='pending')
	created_at = models.DateTimeField(default=timezone.now)

	class Meta:
		db_table = 'accounts_foundationnomination'
