from rest_framework import serializers

from .models import Circle, CircleMembership


class CircleSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    created_by = serializers.EmailField(source='created_by.email', read_only=True)

    class Meta:
        model = Circle
        fields = (
            'id', 'name', 'circle_type', 'plan_tier', 'visibility', 'created_by',
            'contribution_amount', 'cadence', 'max_members',
            'membership_fee_percent', 'security_buffer_months', 'status',
            'member_count', 'is_member', 'created_at',
        )
        read_only_fields = fields

    def get_member_count(self, circle):
        return circle.memberships.filter(is_active=True).count()

    def get_is_member(self, circle):
        request = self.context.get('request')
        return bool(
            request
            and request.user.is_authenticated
            and circle.memberships.filter(user=request.user, is_active=True).exists()
        )


class CircleCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    circle_type = serializers.ChoiceField(choices=Circle.TYPE_CHOICES)
    plan_tier = serializers.ChoiceField(choices=Circle.PLAN_CHOICES, required=False, allow_blank=True, default='')
    visibility = serializers.ChoiceField(choices=Circle.VISIBILITY_CHOICES)
    contribution_amount = serializers.IntegerField(min_value=1)
    cadence = serializers.ChoiceField(choices=Circle.CADENCE_CHOICES)
    max_members = serializers.IntegerField(min_value=0, max_value=32767)
    accepts_default_disclaimer = serializers.BooleanField(default=False, write_only=True)

    def validate(self, attrs):
        circle_type = attrs['circle_type']
        max_members = attrs['max_members']
        user = self.context['request'].user

        if circle_type == 'managed':
            if not (user.is_staff or user.is_superuser):
                raise serializers.ValidationError(
                    {'circle_type': 'Only platform staff can create managed circles.'}
                )
            if attrs['visibility'] != 'public' or max_members not in (4, 5):
                raise serializers.ValidationError(
                    'Managed circles must be public and have exactly 4 or 5 members.'
                )
            plan_amounts = {'starter': 2000, 'standard': 5000, 'premium': 10000}
            plan_tier = attrs['plan_tier']
            if plan_tier not in plan_amounts:
                raise serializers.ValidationError({'plan_tier': 'Choose a supported member plan.'})
            if attrs['contribution_amount'] != plan_amounts[plan_tier]:
                raise serializers.ValidationError({
                    'contribution_amount': 'The contribution must match the selected member plan.'
                })
        else:
            if attrs['visibility'] != 'private':
                raise serializers.ValidationError(
                    {'visibility': 'Friends and family circles must be private.'}
                )
            if max_members not in (0, 2, 3, 4, 5):
                raise serializers.ValidationError(
                    {'max_members': 'Private circles support 2, 3, 4, 5, or unlimited members.'}
                )
            if max_members in (2, 3) and not attrs['accepts_default_disclaimer']:
                raise serializers.ValidationError({
                    'accepts_default_disclaimer':
                        'Accept the peer-trust default disclaimer for 2- or 3-member circles.'
                })

        return attrs


class AdminCircleMemberSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = CircleMembership
        fields = ('id', 'name', 'email', 'phone', 'rotation_order', 'is_active', 'joined_at')
        read_only_fields = fields


class AdminCircleSerializer(CircleSerializer):
    members = AdminCircleMemberSerializer(source='memberships', many=True, read_only=True)

    class Meta(CircleSerializer.Meta):
        fields = CircleSerializer.Meta.fields + ('members',)


class CircleJoinSerializer(serializers.Serializer):
    accepts_default_disclaimer = serializers.BooleanField(required=False, default=False)