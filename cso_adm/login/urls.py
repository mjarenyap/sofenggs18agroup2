from django.conf.urls import url
from django.contrib.auth import views as auth_views

from login import views

app_name = 'login'

urlpatterns = [
    # /login/
    url(r'^$', views.login_failed, name='login_page'),
]
