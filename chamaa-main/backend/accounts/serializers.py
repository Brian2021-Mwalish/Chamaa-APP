from rest_framework import serializers

from .models import User


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('phone', 'name', 'email', 'is_staff')
        read_only_fields = ('phone', 'is_staff')