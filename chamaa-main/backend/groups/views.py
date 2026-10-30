from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Circle, CircleMembership, Contribution, Payout
from .serializers import (
	AdminCircleSerializer,
	CircleCreateSerializer,
	CircleJoinSerializer,
	CircleSerializer,
)


class IsStaffOrSuperuser(BasePermission):
	def has_permission(self, request, view):
		return bool(
			request.user
			and request.user.is_authenticated
			and (request.user.is_staff or request.user.is_superuser)
		)


class CircleListCreateView(APIView):
	permission_classes = (IsAuthenticated,)

	def get(self, request):
		circles = Circle.objects.filter(
			Q(visibility='public', status__in=('forming', 'active'))
			| Q(created_by=request.user)
			| Q(memberships__user=request.user, memberships__is_active=True)
		).distinct().prefetch_related('memberships')
		return Response(CircleSerializer(circles, many=True, context={'request': request}).data)

	def post(self, request):
		serializer = CircleCreateSerializer(data=request.data, context={'request': request})
		serializer.is_valid(raise_exception=True)
		values = serializer.validated_data
		circle_type = values['circle_type']

		with transaction.atomic():
			circle = Circle.objects.create(
				name=values['name'],
				circle_type=circle_type,
				visibility=values['visibility'],
				created_by=request.user,
				contribution_amount=values['contribution_amount'],
				plan_tier=values.get('plan_tier', ''),
				cadence=values['cadence'],
				max_members=values['max_members'],
				membership_fee_percent=1 if circle_type == 'managed' else 0,
				security_buffer_months=1 if circle_type == 'managed' else 0,
			)
			if circle_type == 'private':
				CircleMembership.objects.create(
					circle=circle,
					user=request.user,
					rotation_order=1,
					accepted_default_disclaimer=values['accepts_default_disclaimer'],
				)

		return Response(
			CircleSerializer(circle, context={'request': request}).data,
			status=status.HTTP_201_CREATED,
		)


class CircleJoinView(APIView):
	permission_classes = (IsAuthenticated,)

	def post(self, request, circle_id):
		serializer = CircleJoinSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		with transaction.atomic():
			circle = get_object_or_404(
				Circle.objects.select_for_update().prefetch_related('memberships'),
				pk=circle_id,
			)
			if circle.circle_type == 'private':
				return Response(
					{'detail': 'Private circles can only be joined by invitation.'},
					status=status.HTTP_403_FORBIDDEN,
				)
			if circle.visibility != 'public' or circle.status != 'forming':
				return Response(
					{'detail': 'This circle is not accepting new members.'},
					status=status.HTTP_409_CONFLICT,
				)
			if circle.circle_type == 'managed' and request.user.selected_plan != circle.plan_tier:
				return Response(
					{'detail': 'Your selected plan does not match this circle.'},
					status=status.HTTP_409_CONFLICT,
				)
			if CircleMembership.objects.filter(circle=circle, user=request.user).exists():
				return Response(
					{'detail': 'You are already a member of this circle.'},
					status=status.HTTP_409_CONFLICT,
				)

			memberships = list(circle.memberships.filter(is_active=True))
			if circle.max_members and len(memberships) >= circle.max_members:
				return Response(
					{'detail': 'This circle has reached its member limit.'},
					status=status.HTTP_409_CONFLICT,
				)

			membership = CircleMembership.objects.create(
				circle=circle,
				user=request.user,
				rotation_order=len(memberships) + 1,
			)
			if len(memberships) + 1 == circle.max_members:
				circle.status = 'active'
				circle.save(update_fields=['status'])

		return Response(
			CircleSerializer(circle, context={'request': request}).data,
			status=status.HTTP_200_OK,
		)


class AdminGroupOverviewView(APIView):
	permission_classes = (IsStaffOrSuperuser,)

	def get(self, request):
		circles = Circle.objects.select_related('created_by').prefetch_related(
			'memberships__user'
		).order_by('-created_at')
		activity = []
		for circle in circles:
			activity.append({
				'id': f'circle-{circle.id}',
				'kind': 'circle_created',
				'group_id': circle.id,
				'group_name': circle.name,
				'description': f'{circle.name} was created',
				'occurred_at': circle.created_at,
			})
			for membership in circle.memberships.all():
				activity.append({
					'id': f'member-{membership.id}',
					'kind': 'member_joined',
					'group_id': circle.id,
					'group_name': circle.name,
					'description': f'{membership.user.name or membership.user.email} joined {circle.name}',
					'occurred_at': membership.joined_at,
				})
		for contribution in Contribution.objects.select_related('membership__user', 'membership__circle'):
			activity.append({
				'id': f'contribution-{contribution.id}',
				'kind': f'contribution_{contribution.status}',
				'group_id': contribution.membership.circle_id,
				'group_name': contribution.membership.circle.name,
				'description': f'{contribution.membership.user.name or contribution.membership.user.email} contribution {contribution.status}',
				'occurred_at': contribution.paid_at or contribution.created_at,
			})
		for payout in Payout.objects.select_related('recipient__user', 'circle'):
			activity.append({
				'id': f'payout-{payout.id}',
				'kind': f'payout_{payout.status}',
				'group_id': payout.circle_id,
				'group_name': payout.circle.name,
				'description': f'Payout {payout.status} for {payout.recipient.user.name or payout.recipient.user.email}',
				'occurred_at': payout.paid_at or payout.created_at,
			})
		activity.sort(key=lambda item: item['occurred_at'], reverse=True)
		for item in activity:
			item['occurred_at'] = item['occurred_at'].isoformat()
		return Response({
			'groups': AdminCircleSerializer(circles, many=True).data,
			'activity': activity[:200],
		})
