from pathlib import Path

from rest_framework import serializers

from .models import KYCSubmission, User


class SignupSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=150)
    phone = serializers.CharField(max_length=32)
    email = serializers.EmailField()


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
    class Meta:
        model = User
        fields = (
            'phone', 'name', 'email', 'selected_plan', 'is_staff', 'phone_verified',
            'onboarding_stage'
        )
        read_only_fields = (
            'phone', 'is_staff', 'phone_verified', 'onboarding_stage'
        )