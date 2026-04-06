from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken

from .authentication import StudentSigner
from .models import Student
from .serializers import AdminLoginSerializer, StudentSerializer, StudentLoginSerializer


class AdminLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password'],
        )
        if user is None or not user.is_staff:
            return Response({'detail': 'Invalid admin credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'username': user.username,
        })


class StudentListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        students = Student.objects.all().order_by('-created_at')
        return Response(StudentSerializer(students, many=True).data)

    def post(self, request):
        serializer = StudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class StudentDetailView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        student = Student.objects.filter(pk=pk).first()
        if not student:
            return Response({'detail': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = StudentSerializer(student, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        student = Student.objects.filter(pk=pk).first()
        if not student:
            return Response({'detail': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudentLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = StudentLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        student = Student.objects.filter(
            reg_no=serializer.validated_data['reg_no'],
            is_active=True,
        ).first()
        if not student or not check_password(serializer.validated_data['password'], student.password):
            return Response({'detail': 'Invalid student credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            'id': student.id,
            'reg_no': student.reg_no,
            'full_name': student.full_name,
            'department': student.department,
            'level': student.level,
            'student_token': StudentSigner.issue_token(student),
            'token_type': 'StudentToken',
        })
