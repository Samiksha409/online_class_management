from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Student, Teacher

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "role"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    employee_id = serializers.CharField(required=False, allow_blank=True)
    roll_number = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    program = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "role",
            "employee_id",
            "roll_number",
            "department",
            "program",
        ]

    def validate(self, attrs):
        role = attrs.get("role", User.Role.STUDENT)
        if role == User.Role.TEACHER and not attrs.get("employee_id"):
            raise serializers.ValidationError({"employee_id": "Required for teacher"})
        if role == User.Role.STUDENT and not attrs.get("roll_number"):
            raise serializers.ValidationError({"roll_number": "Required for student"})
        return attrs

    def create(self, validated_data):
        profile_data = {
            "employee_id": validated_data.pop("employee_id", ""),
            "roll_number": validated_data.pop("roll_number", ""),
            "department": validated_data.pop("department", ""),
            "program": validated_data.pop("program", ""),
        }
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if user.role == User.Role.TEACHER:
            Teacher.objects.create(
                user=user,
                employee_id=profile_data["employee_id"],
                department=profile_data["department"] or "General",
            )
        elif user.role == User.Role.STUDENT:
            Student.objects.create(
                user=user,
                roll_number=profile_data["roll_number"],
                program=profile_data["program"] or "B.Tech",
            )
        return user


class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Teacher
        fields = ["id", "user", "employee_id", "department", "specialization"]


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Student
        fields = ["id", "user", "roll_number", "semester", "program"]
