from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.throw_404, name='page_404')
]
