from django.conf import settings
from django.db import models

from accounts.models import Student, Teacher


class Course(models.Model):
    name = models.CharField(max_length=120)
    code = models.CharField(max_length=30, unique=True, db_index=True)
    description = models.TextField(blank=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, related_name="courses")

    class Meta:
        db_table = "courses"

    def __str__(self):
        return f"{self.code} - {self.name}"


class ClassSession(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="class_sessions")
    title = models.CharField(max_length=150)
    scheduled_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = "classes"
        indexes = [models.Index(fields=["scheduled_date"]), models.Index(fields=["course"])]

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    enrolled_on = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "enrollments"
        unique_together = ("student", "course")


class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="assignments")
    title = models.CharField(max_length=150)
    description = models.TextField()
    due_date = models.DateTimeField()
    max_marks = models.PositiveIntegerField(default=100)
    created_by = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, related_name="assignments")

    class Meta:
        db_table = "assignments"
        indexes = [models.Index(fields=["due_date"])]


class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="submissions")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="submissions")
    submission_text = models.TextField(blank=True)
    submitted_file_url = models.URLField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    marks_obtained = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        db_table = "submissions"
        unique_together = ("assignment", "student")


class Attendance(models.Model):
    class Status(models.TextChoices):
        PRESENT = "present", "Present"
        ABSENT = "absent", "Absent"
        LATE = "late", "Late"

    class_session = models.ForeignKey(ClassSession, on_delete=models.CASCADE, related_name="attendance_records")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="attendance_records")
    status = models.CharField(max_length=20, choices=Status.choices)
    marked_by = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, related_name="attendance_marked")
    marked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "attendance"
        unique_together = ("class_session", "student")


class StudyMaterial(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="study_materials")
    title = models.CharField(max_length=150)
    material_url = models.URLField()
    uploaded_by = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, related_name="study_materials")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "study_materials"


class Notice(models.Model):
    title = models.CharField(max_length=150)
    content = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="notices", null=True, blank=True)
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="notices")
    posted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notices"
        ordering = ["-posted_at"]
