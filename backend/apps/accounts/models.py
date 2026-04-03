from django.db import models


class Student(models.Model):
    reg_no = models.CharField(max_length=30, unique=True)
    full_name = models.CharField(max_length=120)
    department = models.CharField(max_length=100)
    level = models.CharField(max_length=20)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reg_no} - {self.full_name}"
