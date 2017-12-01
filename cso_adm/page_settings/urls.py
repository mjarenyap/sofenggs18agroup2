from django.conf.urls import include, url
from . import views

app_name = 'settings'

urlpatterns = [
    # /settings/
    url(r'^$', views.SettingsView.as_view(), name='settings'),

    # /settings/remove/
    url(r'remove/$', views.remove_moderator, name='remove'),

    # /settings/add/
    url(r'add/$', views.add_moderator, name='add'),

    # /settings/update/
    url(r'update/$', views.update_moderator, name='update'),

    url(r'get_settings_contexts/$', views.get_response_context, name='get_settings_contexts'),
]
