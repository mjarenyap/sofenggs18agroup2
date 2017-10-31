from django.conf.urls import url
from django.contrib.auth import views as auth_views

from dashboard import views

app_name = 'logout'

urlpatterns = [
    # /logout/
    # url(r'^$', auth_views.logout, name='logout'),
]
