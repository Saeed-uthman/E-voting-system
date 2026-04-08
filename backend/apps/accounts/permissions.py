from rest_framework.permissions import BasePermission


class IsAuthenticatedStudent(BasePermission):
    def has_permission(self, request, view):
        student = getattr(request, 'student', None)
        return student is not None and student.is_active
