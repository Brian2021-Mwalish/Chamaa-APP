from pathlib import Path

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import KYCSubmission, User


class SignupSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    phone = serializers.CharField(max_length=32, min_length=7)

    def validate_phone(self, value):
        value = value.strip()
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError('An account with this phone number already exists.')
        return value

    def validate_email(self, value):
        value = User.objects.normalize_email(value).lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

    def validate_password(self, value):
        try:
            validate_password(value, user=User(email=self.initial_data.get('email', '')))
        except DjangoValidationError as error:
            raise serializers.ValidationError(list(error.messages)) from error
        return value


class KYCSubmissionSerializer(serializers.ModelSerializer):
    id_document = serializers.FileField(write_only=True)
    income_document = serializers.FileField(write_only=True)
    id_document_uploaded = serializers.BooleanField(source='id_document', read_only=True)
    income_document_uploaded = serializers.BooleanField(source='income_document', read_only=True)

    class Meta:
        model = KYCSubmission
        fields = (
            'full_name', 'id_document', 'income_document', 'id_document_uploaded',
            'income_document_uploaded', 'status', 'submitted_at'
        )
        read_only_fields = (
            'id_document_uploaded', 'income_document_uploaded', 'status', 'submitted_at'
        )

    def validate_id_document(self, uploaded_file):
        self._validate_file(
            uploaded_file,
            allowed_extensions={'.jpg', '.jpeg', '.png'},
            max_size=5 * 1024 * 1024,
            label='ID image',
        )
        return uploaded_file

    def validate_income_document(self, uploaded_file):
        self._validate_file(
            uploaded_file,
            allowed_extensions={'.pdf', '.jpg', '.jpeg', '.png'},
            max_size=10 * 1024 * 1024,
            label='Income document',
        )
        return uploaded_file

    @staticmethod
    def _validate_file(uploaded_file, *, allowed_extensions, max_size, label):
        extension = Path(uploaded_file.name).suffix.lower()
        if extension not in allowed_extensions:
            raise serializers.ValidationError(
                f'{label} must use one of: {", ".join(sorted(allowed_extensions))}.'
            )
        if uploaded_file.size > max_size:
            raise serializers.ValidationError(
                f'{label} exceeds the {max_size // (1024 * 1024)}MB limit.'
            )


class UserProfileSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'phone', 'name', 'email', 'selected_plan', 'payment_mode', 'is_staff', 'is_admin',
            'phone_verified', 'onboarding_stage'
        )
        read_only_fields = (
            'phone', 'is_staff', 'is_admin', 'phone_verified', 'onboarding_stage'
        )

    def get_is_admin(self, user):
        return user.is_staff or user.is_superuser


class AdminUserSerializer(serializers.ModelSerializer):
    plan = serializers.CharField(source='get_selected_plan_display', read_only=True)
    kyc_status = serializers.SerializerMethodField()
    kyc_full_name = serializers.SerializerMethodField()
    kyc_submitted_at = serializers.SerializerMethodField()
    id_document_uploaded = serializers.SerializerMethodField()
    income_document_uploaded = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'name', 'email', 'phone', 'plan', 'payment_mode', 'onboarding_stage',
            'kyc_status', 'kyc_full_name', 'kyc_submitted_at',
            'id_document_uploaded', 'income_document_uploaded', 'is_active',
            'is_staff', 'is_admin', 'date_joined'
        )
        read_only_fields = fields

    def get_kyc_status(self, user):
        submission = getattr(user, 'kyc_submission', None)
        return submission.status if submission else 'not_submitted'

    def get_kyc_full_name(self, user):
        submission = getattr(user, 'kyc_submission', None)
        return submission.full_name if submission else ''

    def get_kyc_submitted_at(self, user):
        submission = getattr(user, 'kyc_submission', None)
        return submission.submitted_at if submission else None

    def get_id_document_uploaded(self, user):
        submission = getattr(user, 'kyc_submission', None)
        return bool(submission and submission.id_document)

    def get_income_document_uploaded(self, user):
        submission = getattr(user, 'kyc_submission', None)
        return bool(submission and submission.income_document)

    def get_is_admin(self, user):
        return user.is_staff or user.is_superuser