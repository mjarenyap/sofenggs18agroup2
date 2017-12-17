from django.contrib import admin
from .models import Organization, PostActsLog, Map, OrgComment

# Register your models here.
admin.site.register(Organization)
admin.site.register(PostActsLog)
admin.site.register(Map)
admin.site.register(OrgComment)
