from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^$', views.test_url, name='test_url')
]