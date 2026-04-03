from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Student


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'reg_no', 'full_name', 'department', 'level', 'password', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}


class StudentLoginSerializer(serializers.Serializer):
    reg_no = serializers.CharField()
    password = serializers.CharField(write_only=True)
