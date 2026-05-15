from django.contrib import admin

from .models import Assignment, Attendance, ClassSession, Course, Enrollment, Notice, StudyMaterial, Submission

admin.site.register(Course)
admin.site.register(ClassSession)
admin.site.register(Enrollment)
admin.site.register(Assignment)
admin.site.register(Submission)
admin.site.register(Attendance)
admin.site.register(StudyMaterial)
admin.site.register(Notice)
