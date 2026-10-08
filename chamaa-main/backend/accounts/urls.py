from django.urls import path

from .views import CurrentUserView, LogoutView, RequestOtpView, VerifyOtpView

urlpatterns = [
    path('otp/request/', RequestOtpView.as_view(), name='request-otp'),
    path('otp/verify/', VerifyOtpView.as_view(), name='verify-otp'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('logout/', LogoutView.as_view(), name='logout'),
]