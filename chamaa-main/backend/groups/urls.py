from django.urls import path

from .views import AdminGroupOverviewView, CircleJoinView, CircleListCreateView

urlpatterns = [
    path('admin/overview/', AdminGroupOverviewView.as_view(), name='admin-group-overview'),
    path('circles/', CircleListCreateView.as_view(), name='circle-list-create'),
    path('circles/<int:circle_id>/join/', CircleJoinView.as_view(), name='circle-join'),
]