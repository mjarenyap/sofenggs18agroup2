from django.contrib import admin
from .models import Activity, PostActsLog, PostActRequirements, Organization

# Register your models here.
admin.site.register(Organization)
admin.site.register(Activity)
admin.site.register(PostActsLog)
admin.site.register(PostActRequirements)