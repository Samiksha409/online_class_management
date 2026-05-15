from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from accounts.models import Student, Teacher, User
from academics.models import Assignment, ClassSession, Course, Enrollment, Notice


class Command(BaseCommand):
    help = "Seed sample users and academic data"

    def handle(self, *args, **options):
        admin, _ = User.objects.get_or_create(
            username="admin",
            defaults={"email": "admin@example.com", "role": "admin", "is_staff": True, "is_superuser": True},
        )
        admin.set_password("admin123")
        admin.save()

        teacher_user, _ = User.objects.get_or_create(
            username="teacher1",
            defaults={"email": "teacher1@example.com", "role": "teacher", "first_name": "Asha"},
        )
        teacher_user.set_password("teacher123")
        teacher_user.save()

        teacher, _ = Teacher.objects.get_or_create(
            user=teacher_user,
            defaults={"employee_id": "EMP001", "department": "Computer Science"},
        )

        student_user, _ = User.objects.get_or_create(
            username="student1",
            defaults={"email": "student1@example.com", "role": "student", "first_name": "Rahul"},
        )
        student_user.set_password("student123")
        student_user.save()

        student, _ = Student.objects.get_or_create(
            user=student_user,
            defaults={"roll_number": "CS2026-001", "semester": 6, "program": "B.Tech CSE"},
        )

        course, _ = Course.objects.get_or_create(
            code="CS301",
            defaults={"name": "Database Systems", "teacher": teacher, "description": "Core DBMS course"},
        )
        class_session, _ = ClassSession.objects.get_or_create(
            course=course,
            title="Normalization and Indexing",
            scheduled_date=timezone.now().date(),
            start_time=timezone.now().time(),
            end_time=timezone.now().time(),
        )
        Enrollment.objects.get_or_create(student=student, course=course)
        Assignment.objects.get_or_create(
            course=course,
            title="ER Diagram Submission",
            defaults={
                "description": "Design normalized schema with constraints",
                "due_date": timezone.now() + timedelta(days=7),
                "created_by": teacher,
            },
        )
        Notice.objects.get_or_create(
            title="Welcome to Online Class Management",
            content="Seed data generated successfully.",
            posted_by=admin,
            course=course,
        )

        self.stdout.write(self.style.SUCCESS("Sample data seeded."))
