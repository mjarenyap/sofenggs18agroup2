from django.conf.urls import include, url
from . import views

app_name = 'org_list'

urlpatterns = [

    # /organization/
    url(r'^$', views.OrgGeneralView.as_view(), name='general_orgs'),

    # /organization/<organization_name> (alphanumeric w/underscore)
    url(r'^(?P<org_name>[\w]+)$', views.OrgSpecificView.as_view(), name='specific_org'),
    # /update/
    url(r'^([A-Z][\w]+)/get_org_specific_contexts/$', views.get_response_context_specific, name='get_org_specific_contexts'),
    # [Organization Specific]
    # This app previews overview/summary and post-acts of a certain organization
    url(r'^0/', include('org_specific.urls')),

    # /update/
    url(r'update/$', views.save_post_acts, name='update'),

    # /update/
    url(r'get_org_list_contexts/$', views.get_response_context, name='get_org_list_contexts'),

    # /get log/
    url(r'get_log/$', views.get_log, name='get_log')
]
