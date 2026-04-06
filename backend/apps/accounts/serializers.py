from rest_framework import serializers
from django.contrib.auth.hashers import make_password

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

    def create(self, validated_data):
        password = validated_data.pop('password')
        return Student.objects.create(password=make_password(password), **validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance


class StudentLoginSerializer(serializers.Serializer):
    reg_no = serializers.CharField()
    password = serializers.CharField(write_only=True)
