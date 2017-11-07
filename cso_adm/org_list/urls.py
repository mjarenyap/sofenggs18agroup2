from django.conf.urls import include, url
from . import views

app_name = 'org_list'

urlpatterns = [

    # /organization/
    url(r'^$', views.UserFormView.as_view(), name='general_orgs'),

    # /organization/<organization_name> (alphanumeric w/underscore)
    url(r'^(?P<username>[\w]+)$', views.test_url, name='specific_org'),

    # [Organization Specific]
    # This app previews overview/summary and post-acts of a certain organization
    url(r'^0/', include('org_specific.urls'))
]
