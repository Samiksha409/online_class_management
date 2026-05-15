from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Assignment, Attendance, ClassSession, Course, Enrollment, Notice, StudyMaterial, Submission
from .serializers import (
    AssignmentSerializer,
    AttendanceSerializer,
    ClassSessionSerializer,
    CourseSerializer,
    EnrollmentSerializer,
    NoticeSerializer,
    StudyMaterialSerializer,
    SubmissionSerializer,
)


class IsTeacherOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["teacher", "admin"]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related("teacher").all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsTeacherOrAdmin()]
        return [permissions.IsAuthenticated()]


class ClassSessionViewSet(viewsets.ModelViewSet):
    queryset = ClassSession.objects.select_related("course").all()
    serializer_class = ClassSessionSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsTeacherOrAdmin()]
        return [permissions.IsAuthenticated()]


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.select_related("student", "course").all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.select_related("course", "created_by").all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.select_related("assignment", "student").all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related("class_session", "student", "marked_by").all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]


class StudyMaterialViewSet(viewsets.ModelViewSet):
    queryset = StudyMaterial.objects.select_related("course", "uploaded_by").all()
    serializer_class = StudyMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.select_related("course", "posted_by").all()
    serializer_class = NoticeSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def dashboard_summary(request):
    today = timezone.localdate()
    now = timezone.now()

    upcoming_sessions = (
        ClassSession.objects.select_related("course")
        .filter(scheduled_date__gte=today)
        .order_by("scheduled_date", "start_time")[:6]
    )
    upcoming_assignments = (
        Assignment.objects.select_related("course")
        .filter(due_date__gte=now)
        .order_by("due_date")[:6]
    )
    recent_notices = Notice.objects.select_related("course").order_by("-posted_at")[:6]

    data = {
        "students": Enrollment.objects.values("student").distinct().count(),
        "teachers": Course.objects.exclude(teacher=None).values("teacher").distinct().count(),
        "courses": Course.objects.count(),
        "classes_today": ClassSession.objects.filter(scheduled_date=today).count(),
        "classes_total": ClassSession.objects.count(),
        "assignments": Assignment.objects.count(),
        "submissions": Submission.objects.count(),
        "attendance_records": Attendance.objects.count(),
        "study_materials_count": StudyMaterial.objects.count(),
        "latest_notices": [
            {
                "id": n.id,
                "title": n.title,
                "content": (
                    ((n.content or "")[:120] + "…")
                    if len(n.content or "") > 120
                    else (n.content or "")
                ),
                "posted_at": n.posted_at.isoformat(),
                "course_name": n.course.name if n.course_id else None,
            }
            for n in recent_notices
        ],
        "upcoming_sessions": [
            {
                "id": s.id,
                "title": s.title,
                "course_code": s.course.code,
                "course_name": s.course.name,
                "scheduled_date": s.scheduled_date.isoformat(),
                "start_time": s.start_time.isoformat(timespec="minutes"),
                "end_time": s.end_time.isoformat(timespec="minutes"),
                "room": s.room or "—",
            }
            for s in upcoming_sessions
        ],
        "upcoming_assignments": [
            {
                "id": a.id,
                "title": a.title,
                "course_code": a.course.code,
                "due_date": a.due_date.isoformat(),
                "max_marks": a.max_marks,
            }
            for a in upcoming_assignments
        ],
    }
    return Response(data)
