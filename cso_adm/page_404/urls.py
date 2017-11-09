from django.conf.urls import url
from . import views

app_name = 'page_404'

urlpatterns = [
    url(r'^$', views.throw_404, name='page_404')
]
