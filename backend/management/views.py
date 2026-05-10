from rest_framework import viewsets

from .models import *
from .serializers import *


class MemberViewSet(viewsets.ModelViewSet):

    queryset = Member.objects.all()

    serializer_class = MemberSerializer


class TypeViewSet(viewsets.ModelViewSet):

    queryset = Type.objects.all()

    serializer_class = TypeSerializer


class InstructorViewSet(viewsets.ModelViewSet):

    queryset = Instructor.objects.all()

    serializer_class = InstructorSerializer


class ClassViewSet(viewsets.ModelViewSet):

    queryset = Class.objects.all()

    serializer_class = ClassSerializer


class ClassScheduleViewSet(viewsets.ModelViewSet):

    queryset = ClassSchedule.objects.all()

    serializer_class = ClassScheduleSerializer


class MemberSignupViewSet(viewsets.ModelViewSet):

    queryset = MemberSignup.objects.all()

    serializer_class = MemberSignupSerializer