from django.urls import path

from .views import (
    AccountsHealthView,
    AdminLoginView,
    StudentListCreateView,
    StudentLoginView,
    StudentVerificationView,
)

urlpatterns = [
    path("health/", AccountsHealthView.as_view(), name="accounts-health"),
    path("admin/login/", AdminLoginView.as_view(), name="admin-login"),
    path("students/verify/", StudentVerificationView.as_view(), name="student-verify"),
    path("students/login/", StudentLoginView.as_view(), name="student-login"),
    path("students/", StudentListCreateView.as_view(), name="student-list-create"),
]
