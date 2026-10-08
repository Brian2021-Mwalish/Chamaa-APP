from django.urls import path

from .views import (
    AdvanceOnboardingView,
    CurrentUserView,
    LogoutView,
    RequestOtpView,
    SignupView,
    VerifyOtpView,
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('otp/request/', RequestOtpView.as_view(), name='request-otp'),
    path('otp/verify/', VerifyOtpView.as_view(), name='verify-otp'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('onboarding/advance/', AdvanceOnboardingView.as_view(), name='advance-onboarding'),
    path('logout/', LogoutView.as_view(), name='logout'),
]