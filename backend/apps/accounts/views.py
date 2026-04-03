from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Student
from .serializers import AdminLoginSerializer, StudentLoginSerializer, StudentSerializer, StudentVerificationSerializer


class AccountsHealthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"service": "accounts", "status": "ok"})


class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return Response(
            {
                "message": "Admin login successful.",
                "data": serializer.validated_data,
            },
            status=status.HTTP_200_OK,
        )


class StudentVerificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = StudentVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.validated_data["student"]

        return Response(
            {
                "message": "Student verified successfully.",
                "data": StudentSerializer(student).data,
            },
            status=status.HTTP_200_OK,
        )


class StudentLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = StudentLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.save()

        return Response(
            {
                "message": "Student login successful.",
                "data": payload,
            },
            status=status.HTTP_200_OK,
        )


class StudentListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        students = Student.objects.all().order_by("student_id")
        serializer = StudentSerializer(students, many=True)
        return Response({"message": "Students retrieved.", "data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = StudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Student created successfully.", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )
