from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(Member)
admin.site.register(Type)
admin.site.register(Instructor)
admin.site.register(Class)
admin.site.register(ClassSchedule)
admin.site.register(MemberSignup)