from django.conf.urls import include, url
from . import views

app_name = 'settings'

urlpatterns = [
    url(r'^$', views.SettingsView.as_view(), name='settings')
]
