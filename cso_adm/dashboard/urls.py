import django.views.defaults
from django.conf.urls import url
from . import views

app_name = 'dashboard'

urlpatterns = [
    # /
    url(r'^$', views.UserFormView.as_view(), name='index'),

    # /update/
    url(r'update/$', views.save_post_acts, name='update'),

    # /update/
    url(r'get_dashboard_contexts/$', views.get_response_context, name='get_dashboard_contexts'),

    # /update/
    url(r'get_log/$', views.get_log, name='get_log'),

    # 404 fallback
    # url(r'^404/$', django.views.defaults.page_not_found, name='404'),
]
