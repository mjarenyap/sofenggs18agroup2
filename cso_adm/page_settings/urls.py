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
    url(r'edit/$', views.update_moderator, name='update'),

    # TODO: moderator settings URL pattern to accommodate moderator settings
    # /settings/settings-moderator/
    # url(r'settings-moderator/$', <view>, name='<namespace>'),

    url(r'get_settings_contexts/$', views.get_response_context, name='get_settings_contexts'),

    url(r'set_term/$', views.set_default_term, name='set_term'),
]
