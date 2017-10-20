from django.conf.urls import url
from django.contrib.auth import views as auth_views

app_name = 'login'

urlpatterns = [
    # /login/
    # url(r'^$', auth_views.LoginView.as_view(redirect_authenticated_user=True), name='login'),
]
