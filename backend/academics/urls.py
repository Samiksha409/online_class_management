from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AssignmentViewSet,
    AttendanceViewSet,
    ClassSessionViewSet,
    CourseViewSet,
    EnrollmentViewSet,
    NoticeViewSet,
    StudyMaterialViewSet,
    SubmissionViewSet,
    dashboard_summary,
)

router = DefaultRouter()
router.register("courses", CourseViewSet, basename="courses")
router.register("class-sessions", ClassSessionViewSet, basename="class-sessions")
router.register("enrollments", EnrollmentViewSet, basename="enrollments")
router.register("assignments", AssignmentViewSet, basename="assignments")
router.register("submissions", SubmissionViewSet, basename="submissions")
router.register("attendance", AttendanceViewSet, basename="attendance")
router.register("study-materials", StudyMaterialViewSet, basename="study-materials")
router.register("notices", NoticeViewSet, basename="notices")

urlpatterns = [
    path("dashboard/summary/", dashboard_summary, name="dashboard-summary"),
    path("", include(router.urls)),
]
