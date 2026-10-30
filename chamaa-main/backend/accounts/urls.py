from django.urls import path

from .views import (
    AdvanceOnboardingView,
    AdminUsersView,
    AdminKycDocumentView,
    AdminKycReviewView,
    AdminUserStatusView,
    CurrentUserView,
    KYCSubmissionView,
    LoginView,
    LogoutView,
    SignupView,
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('admin/users/', AdminUsersView.as_view(), name='admin-users'),
    path('admin/users/<int:user_id>/status/', AdminUserStatusView.as_view(), name='admin-user-status'),
    path('admin/users/<int:user_id>/kyc/', AdminKycReviewView.as_view(), name='admin-kyc-review'),
    path('admin/users/<int:user_id>/kyc/documents/<str:document_type>/', AdminKycDocumentView.as_view(), name='admin-kyc-document'),
    path('kyc/submit/', KYCSubmissionView.as_view(), name='submit-kyc'),
    path('onboarding/advance/', AdvanceOnboardingView.as_view(), name='advance-onboarding'),
    path('logout/', LogoutView.as_view(), name='logout'),
]