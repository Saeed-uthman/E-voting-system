from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "student_id",
            "first_name",
            "last_name",
            "email",
            "department",
            "year_of_study",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class StudentVerificationSerializer(serializers.Serializer):
    student_id = serializers.CharField(max_length=30)
    email = serializers.EmailField()

    def validate(self, attrs):
        student = Student.objects.filter(
            student_id=attrs["student_id"],
            email__iexact=attrs["email"],
        ).first()

        if not student:
            raise serializers.ValidationError("Student record was not found.")

        if not student.is_active:
            raise serializers.ValidationError("Student is not eligible to vote.")

        attrs["student"] = student
        return attrs


class StudentLoginSerializer(StudentVerificationSerializer):
    def create(self, validated_data):
        student = validated_data["student"]
        token = AccessToken()
        token["role"] = "student"
        token["student_id"] = student.student_id
        token["student_pk"] = student.pk

        return {
            "student": StudentSerializer(student).data,
            "access": str(token),
        }


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        request = self.context.get("request")
        user = authenticate(
            request=request,
            username=attrs.get("username"),
            password=attrs.get("password"),
        )

        if user is None:
            raise serializers.ValidationError("Invalid admin credentials.")

        if not user.is_active:
            raise serializers.ValidationError("Admin account is disabled.")

        if not user.is_staff:
            raise serializers.ValidationError("Admin access requires a staff account.")

        refresh = RefreshToken.for_user(user)
        attrs["admin"] = {
            "id": user.id,
            "username": user.get_username(),
            "is_staff": user.is_staff,
        }
        attrs["tokens"] = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        return attrs
