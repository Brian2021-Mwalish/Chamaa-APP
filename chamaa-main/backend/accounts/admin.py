from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import KYCSubmission, User


class AccountCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('email', 'phone')


class AccountChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = '__all__'


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    add_form = AccountCreationForm
    form = AccountChangeForm
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'phone', 'selected_plan')}),
        ('Onboarding', {'fields': ('phone_verified', 'onboarding_stage')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {'classes': ('wide',), 'fields': ('email', 'phone', 'password1', 'password2')}),
    )
    list_display = (
        'email', 'phone', 'name', 'selected_plan', 'onboarding_stage',
        'phone_verified', 'is_staff', 'is_active'
    )
    list_filter = ('is_staff', 'is_active', 'is_superuser')
    search_fields = ('email', 'phone', 'name')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions')


@admin.register(KYCSubmission)
class KYCSubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'status', 'submitted_at', 'updated_at')
    list_filter = ('status', 'submitted_at')
    search_fields = ('user__phone', 'user__email', 'full_name')
    readonly_fields = ('user', 'id_document', 'income_document', 'submitted_at', 'updated_at')
    fields = ('user', 'full_name', 'id_document', 'income_document', 'status', 'submitted_at', 'updated_at')