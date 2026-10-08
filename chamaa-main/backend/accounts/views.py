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

from .serializers import SignupSerializer, UserProfileSerializer
from .sms import send_otp_sms


def normalize_phone(phone):
    digits = re.sub(r'\D', '', phone)
    if len(digits) == 10 and digits.startswith('0'):
        digits = '254' + digits[1:]
    if not 8 <= len(digits) <= 15:
        raise ValueError('Enter a valid phone number.')
    return '+' + digits


class SignupView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        name = serializer.validated_data['name']
        email = serializer.validated_data['email']
        phone = serializer.validated_data['phone']
        try:
            phone = normalize_phone(phone)
        except ValueError as error:
            return Response(
                {'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST
            )

        user_model = get_user_model()
        if user_model.objects.filter(phone=phone).exists():
            return Response(
                {'detail': 'An account with this phone already exists. Sign in instead.'},
                status=status.HTTP_409_CONFLICT,
            )

        user = user_model.objects.create_user(
            phone=phone, name=name.strip(), email=email
        )
        token = Token.objects.create(user=user)
        return Response(
            {'token': token.key, 'user': UserProfileSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class RequestOtpView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
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

        user_model = get_user_model()
        if not user_model.objects.filter(phone=phone, is_active=True).exists():
            return Response(
                {'detail': 'No account found for this phone. Sign up first.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        code = f'{secrets.randbelow(10000):04d}'
        cache_key = f'accounts:otp:{phone}'
        cache.set(cache_key, code, timeout=180)
        sms_configured = bool(
            settings.AFRICASTALKING_USERNAME and settings.AFRICASTALKING_API_KEY
        )

        if sms_configured:
            try:
                send_otp_sms(phone, code)
            except (OSError, RuntimeError, ValueError):
                cache.delete(cache_key)
                return Response(
                    {'detail': 'Could not send the verification code. Try again.'},
                    status=status.HTTP_502_BAD_GATEWAY,
                )
            return Response({'detail': 'Verification code sent.'})

        if not settings.DEBUG:
            cache.delete(cache_key)
            return Response(
                {'detail': 'SMS delivery is not configured.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({'debug_code': code})


class VerifyOtpView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
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
        try:
            user = user_model.objects.get(phone=phone, is_active=True)
        except user_model.DoesNotExist:
            return Response(
                {'detail': 'No account found for this phone. Sign up first.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        user.phone_verified = True
        user.save(update_fields=['phone_verified'])
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


class AdvanceOnboardingView(APIView):
    permission_classes = (IsAuthenticated,)
    next_stage = {
        'kyc': 'plan',
        'plan': 'membership',
        'membership': 'waiting',
        'waiting': 'app',
    }

    def post(self, request):
        stage = self.next_stage.get(request.user.onboarding_stage)
        if stage is None:
            return Response(
                {'detail': 'Onboarding is already complete.'},
                status=status.HTTP_409_CONFLICT,
            )

        request.user.onboarding_stage = stage
        request.user.save(update_fields=['onboarding_stage'])
        return Response(UserProfileSerializer(request.user).data)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        request.auth.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)