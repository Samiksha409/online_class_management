from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Student, Teacher, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (("Role", {"fields": ("role",)}),)


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "employee_id", "department")
    search_fields = ("user__username", "employee_id")


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "roll_number", "semester", "program")
    search_fields = ("user__username", "roll_number")
