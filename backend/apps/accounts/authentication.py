from django.core import signing
from rest_framework import authentication, exceptions

from .models import Student


class StudentTokenAuthentication(authentication.BaseAuthentication):
    keyword = 'StudentToken'
    salt = 'student-auth'
    max_age_seconds = 60 * 60 * 12

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).split()
        if not auth_header:
            return None

        if auth_header[0].decode().lower() != self.keyword.lower():
            return None

        if len(auth_header) != 2:
            raise exceptions.AuthenticationFailed('Invalid student token header.')

        token = auth_header[1].decode()
        try:
            payload = signing.loads(token, salt=self.salt, max_age=self.max_age_seconds)
        except signing.BadSignature as exc:
            raise exceptions.AuthenticationFailed('Invalid or expired student token.') from exc

        student = Student.objects.filter(id=payload.get('student_id'), is_active=True).first()
        if not student:
            raise exceptions.AuthenticationFailed('Student not found or inactive.')

        request.student = student
        return student, token


class StudentSigner:
    salt = StudentTokenAuthentication.salt

    @classmethod
    def issue_token(cls, student):
        return signing.dumps({'student_id': student.id}, salt=cls.salt)
