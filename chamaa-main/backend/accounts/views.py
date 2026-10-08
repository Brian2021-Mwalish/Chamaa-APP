import re
import secrets

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserProfileSerializer


def normalize_phone(phone):
    digits = re.sub(r'\D', '', phone)
    if len(digits) == 10 and digits.startswith('0'):
        digits = '254' + digits[1:]
    if not 8 <= len(digits) <= 15:
        raise ValueError('Enter a valid phone number.')
    return '+' + digits


class RequestOtpView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
        if not settings.DEBUG:
            return Response(
                {'detail': 'OTP delivery is not configured.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        phone = request.data.get('phone')
        if not isinstance(phone, str):
            return Response(
                {'detail': 'Enter a valid phone number.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            phone = normalize_phone(phone)
        except ValueError as error:
            return Response(
                {'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST
            )

        code = f'{secrets.randbelow(10000):04d}'
        cache.set(f'accounts:otp:{phone}', code, timeout=300)
        return Response({'debug_code': code})


class VerifyOtpView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
        if not settings.DEBUG:
            return Response(
                {'detail': 'OTP delivery is not configured.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        phone = request.data.get('phone')
        code = request.data.get('code')
        if not isinstance(phone, str) or not isinstance(code, str):
            return Response(
                {'detail': 'Phone number and verification code are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            phone = normalize_phone(phone)
        except ValueError as error:
            return Response(
                {'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST
            )

        cache_key = f'accounts:otp:{phone}'
        expected_code = cache.get(cache_key)
        if not expected_code or not secrets.compare_digest(code, expected_code):
            return Response(
                {'detail': 'The verification code is invalid or expired.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cache.delete(cache_key)
        user_model = get_user_model()
        user, _ = user_model.objects.get_or_create(phone=phone)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserProfileSerializer(user).data,
        })


class CurrentUserView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        request.auth.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)