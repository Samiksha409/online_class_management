from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'members', MemberViewSet, basename='member')
router.register(r'types', TypeViewSet, basename='type')
router.register(r'instructors', InstructorViewSet, basename='instructor')
router.register(r'classes', ClassViewSet, basename='class')
router.register(r'schedules', ClassScheduleViewSet, basename='schedule')
router.register(r'signups', MemberSignupViewSet, basename='signup')

urlpatterns = [
    path('', include(router.urls)),
]
