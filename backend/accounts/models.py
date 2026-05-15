from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        TEACHER = "teacher", "Teacher"
        STUDENT = "student", "Student"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)

    class Meta:
        db_table = "users"

    def __str__(self):
        return f"{self.username} ({self.role})"


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="teacher_profile")
    employee_id = models.CharField(max_length=30, unique=True)
    department = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = "teachers"

    def __str__(self):
        return self.user.get_full_name() or self.user.username


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student_profile")
    roll_number = models.CharField(max_length=30, unique=True)
    semester = models.PositiveIntegerField(default=1)
    program = models.CharField(max_length=100)

    class Meta:
        db_table = "students"

    def __str__(self):
        return self.user.get_full_name() or self.user.username
