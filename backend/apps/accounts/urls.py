from django.urls import path
from .views import AdminLoginView, StudentListCreateView, StudentDetailView, StudentLoginView

urlpatterns = [
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('students/', StudentListCreateView.as_view(), name='students-list-create'),
    path('students/<int:pk>/', StudentDetailView.as_view(), name='students-detail'),
    path('students/login/', StudentLoginView.as_view(), name='student-login'),
]
