from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, viewsets

from .permissions import IsAdminUserRole
from .models import Student, Teacher
from .serializers import (
    RegisterSerializer,
    StudentSerializer,
    TeacherSerializer,
    UserSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class TeacherViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Teacher.objects.select_related("user").all()
    serializer_class = TeacherSerializer


class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Student.objects.select_related("user").all()
    serializer_class = StudentSerializer


class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-id")
    serializer_class = UserSerializer
    permission_classes = [IsAdminUserRole]
