from rest_framework import serializers

from .models import *


class UserSerializer(serializers.ModelSerializer):

    class Meta:

        model = User

        fields = ('id', 'email', 'username', 'first_name', 'last_name')


class MemberSerializer(serializers.ModelSerializer):

    class Meta:

        model = Member

        fields = '__all__'


class TypeSerializer(serializers.ModelSerializer):

    class Meta:

        model = Type

        fields = '__all__'


class InstructorSerializer(serializers.ModelSerializer):

    class Meta:

        model = Instructor

        fields = '__all__'


class ClassSerializer(serializers.ModelSerializer):

    class Meta:

        model = Class

        fields = '__all__'


class ClassScheduleSerializer(serializers.ModelSerializer):

    class Meta:

        model = ClassSchedule

        fields = '__all__'


class MemberSignupSerializer(serializers.ModelSerializer):

    class Meta:

        model = MemberSignup

        fields = '__all__'