from django.conf.urls import include, url
from . import views

app_name = 'org_list'

urlpatterns = [

    url(r'^$', views.UserFormView.as_view(), name='index'),

    # [Organization Specific]
    # This app previews overview/summary and post-acts of a certain organization
    url(r'^0/', include('org_specific.urls'))
]
