from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom User model for authentication"""
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email


class Member(models.Model):

    name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return self.name


class Type(models.Model):

    type_name = models.CharField(max_length=100)

    def __str__(self):
        return self.type_name


class Instructor(models.Model):

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Class(models.Model):

    class_name = models.CharField(max_length=100)

    type = models.ForeignKey(
        Type,
        on_delete=models.CASCADE
    )

    duration_mins = models.IntegerField()

    def __str__(self):
        return self.class_name


class ClassSchedule(models.Model):

    class_obj = models.ForeignKey(
        Class,
        on_delete=models.CASCADE
    )

    instructor = models.ForeignKey(
        Instructor,
        on_delete=models.CASCADE
    )

    start_time = models.DateTimeField()

    end_time = models.DateTimeField()

    def __str__(self):
        return f"{self.class_obj.class_name} - {self.start_time}"


class MemberSignup(models.Model):

    member = models.ForeignKey(
        Member,
        on_delete=models.CASCADE
    )

    class_schedule = models.ForeignKey(
        ClassSchedule,
        on_delete=models.CASCADE
    )

    no_show = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.member.name} - {self.class_schedule.class_obj.class_name}"