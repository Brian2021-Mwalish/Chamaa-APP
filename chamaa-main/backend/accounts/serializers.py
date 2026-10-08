from rest_framework import serializers

from .models import User


class SignupSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=150)
    phone = serializers.CharField(max_length=32)
    email = serializers.EmailField()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'phone', 'name', 'email', 'is_staff', 'phone_verified', 'onboarding_stage'
        )
        read_only_fields = (
            'phone', 'is_staff', 'phone_verified', 'onboarding_stage'
        )