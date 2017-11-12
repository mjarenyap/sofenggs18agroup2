from django.conf.urls import url
from . import views

app_name = 'dashboard'

urlpatterns = [
    # /
    url(r'^$', views.UserFormView.as_view(), name='index'),

    # /update/
    url(r'update/$', views.save_post_acts, name='update'),

    # /update/
    url(r'log/$', views.get_log, name='log')
]
