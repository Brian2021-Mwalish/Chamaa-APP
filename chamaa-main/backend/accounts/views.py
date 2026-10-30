import mimetypes

from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from django.http import FileResponse, Http404
from django.utils import timezone
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import KYCSubmission
from .serializers import (
    AdminUserSerializer,
    KYCSubmissionSerializer,
    SignupSerializer,
    UserProfileSerializer,
)


class IsStaffOrSuperuser(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.is_superuser)
        )

class SignupView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        name = serializer.validated_data['name']
        email = serializer.validated_data['email']
        phone = serializer.validated_data.get('phone', '').strip()

        user = get_user_model().objects.create_user(
            email=email,
            password=serializer.validated_data['password'],
            phone=phone,
            name=name.strip(),
        )
        token = Token.objects.create(user=user)
        return Response(
            {'token': token.key, 'user': UserProfileSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not isinstance(email, str) or not isinstance(password, str):
            return Response(
                {'detail': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=email.strip().lower(), password=password)
        if user is None:
            return Response(
                {'detail': 'Email or password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserProfileSerializer(user).data})


class CurrentUserView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class AdminUsersView(APIView):
    permission_classes = (IsStaffOrSuperuser,)

    def get(self, request):
        users = get_user_model().objects.select_related('kyc_submission').order_by('-date_joined')
        return Response(AdminUserSerializer(users, many=True).data)


class AdminUserStatusView(APIView):
    permission_classes = (IsStaffOrSuperuser,)

    def patch(self, request, user_id):
        is_active = request.data.get('is_active')
        if not isinstance(is_active, bool):
            return Response(
                {'is_active': ['This field must be true or false.']},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if user_id == request.user.id and not is_active:
            return Response(
                {'detail': 'You cannot deactivate your own admin account.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_model = get_user_model()
        user = user_model.objects.filter(pk=user_id).first()
        if user is None:
            raise Http404('Account not found.')

        user.is_active = is_active
        user.save(update_fields=['is_active'])
        if not is_active:
            Token.objects.filter(user=user).delete()
        return Response(AdminUserSerializer(user).data)


class AdminKycReviewView(APIView):
    permission_classes = (IsStaffOrSuperuser,)

    def patch(self, request, user_id):
        review_status = request.data.get('status')
        if review_status not in ('approved', 'rejected'):
            return Response(
                {'detail': 'Choose approved or rejected.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        submission = KYCSubmission.objects.filter(user_id=user_id).first()
        if submission is None:
            raise Http404('No KYC submission exists for this account.')

        submission.status = review_status
        submission.save(update_fields=['status', 'updated_at'])
        return Response(AdminUserSerializer(submission.user).data)


class AdminKycDocumentView(APIView):
    permission_classes = (IsStaffOrSuperuser,)

    def get(self, request, user_id, document_type):
        document_fields = {
            'id': 'id_document',
            'income': 'income_document',
        }
        field_name = document_fields.get(document_type)
        if field_name is None:
            raise Http404('Document not found.')

        try:
            submission = KYCSubmission.objects.get(user_id=user_id)
        except KYCSubmission.DoesNotExist as error:
            raise Http404('Document not found.') from error
        document = getattr(submission, field_name)
        if not document:
            raise Http404('Document not found.')

        content_type = mimetypes.guess_type(document.name)[0] or 'application/octet-stream'
        response = FileResponse(
            document.open('rb'),
            content_type=content_type,
            filename=document.name.rsplit('/', 1)[-1],
        )
        response['X-Content-Type-Options'] = 'nosniff'
        return response


class KYCSubmissionView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        payment_mode = request.data.get('payment_mode', 'manual')
        if payment_mode not in dict(get_user_model().PAYMENT_MODE_CHOICES):
            return Response(
                {'payment_mode': ['Choose manual processing or automatic direct debit.']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        existing_submission = KYCSubmission.objects.filter(user=request.user).first()
        serializer = KYCSubmissionSerializer(
            existing_submission,
            data=request.data,
            partial=existing_submission is not None,
        )
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            submission = serializer.save(
                user=request.user,
                status='pending',
                submitted_at=timezone.now(),
            )
            request.user.name = submission.full_name
            request.user.onboarding_stage = 'plan'
            request.user.payment_mode = payment_mode
            request.user.save(update_fields=['name', 'onboarding_stage', 'payment_mode'])

        return Response(
            {
                'submission': KYCSubmissionSerializer(submission).data,
                'user': UserProfileSerializer(request.user).data,
            },
            status=status.HTTP_200_OK,
        )


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