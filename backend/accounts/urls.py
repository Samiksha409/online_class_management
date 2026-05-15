from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ProfileView, RegisterView, StudentViewSet, TeacherViewSet, UserManagementViewSet

router = DefaultRouter()
router.register("teachers", TeacherViewSet, basename="teachers")
router.register("students", StudentViewSet, basename="students")
router.register("users", UserManagementViewSet, basename="users")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("", include(router.urls)),
]
