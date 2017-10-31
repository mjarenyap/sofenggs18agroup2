from django.conf.urls import include, url
from . import views


urlpatterns = [

    url(r'^$', views.test_url, name="test_url"),

    # [Organization Specific]
    # This app previews overview/summary and post-acts of a certain organization
    url(r'^0/', include('org_specific.urls'))
]
