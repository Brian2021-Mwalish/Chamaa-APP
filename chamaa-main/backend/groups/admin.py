from django.contrib import admin

from .models import (
	Circle,
	CircleMembership,
	Contribution,
	Donation,
	FoundationNomination,
	Payout,
)


@admin.register(Circle)
class CircleAdmin(admin.ModelAdmin):
	list_display = ('name', 'circle_type', 'visibility', 'status', 'contribution_amount', 'cadence', 'max_members')
	list_filter = ('circle_type', 'visibility', 'status', 'cadence')
	search_fields = ('name', 'created_by__email')
	readonly_fields = ('created_at',)


@admin.register(CircleMembership)
class CircleMembershipAdmin(admin.ModelAdmin):
	list_display = ('circle', 'user', 'rotation_order', 'is_active', 'auto_debit_opt_in', 'joined_at')
	list_filter = ('is_active', 'auto_debit_opt_in')
	search_fields = ('circle__name', 'user__email', 'user__phone')
	readonly_fields = ('joined_at',)


@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
	list_display = ('membership', 'cycle_number', 'amount', 'status', 'payment_method', 'paid_at')
	list_filter = ('status', 'payment_method', 'created_at')
	search_fields = ('membership__user__email', 'payment_reference')
	readonly_fields = ('created_at',)


@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
	list_display = ('circle', 'recipient', 'cycle_number', 'gross_amount', 'status', 'paid_at')
	list_filter = ('status', 'created_at')
	search_fields = ('circle__name', 'recipient__user__email')
	readonly_fields = ('created_at',)


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
	list_display = ('donor', 'amount', 'status', 'created_at', 'confirmed_at')
	list_filter = ('status', 'created_at')
	search_fields = ('donor__email', 'donor__phone')
	readonly_fields = ('created_at',)


@admin.register(FoundationNomination)
class FoundationNominationAdmin(admin.ModelAdmin):
	list_display = ('title', 'kind', 'status', 'nominated_by', 'created_at')
	list_filter = ('kind', 'status', 'created_at')
	search_fields = ('title', 'description', 'nominated_by__email')
	readonly_fields = ('created_at',)
