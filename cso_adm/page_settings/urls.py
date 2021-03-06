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

    url(r'get_settings_contexts/$', views.get_response_context, name='get_settings_contexts'),

    url(r'set_term/$', views.set_default_term, name='set_term'),

    url(r'change_worksheet_settings/$', views.change_worksheet_settings, name='change_worksheet_settings'),


    url(r'add_org/$', views.add_org, name='add_org'),
    url(r'edit_org/$', views.edit_org, name='edit_org'),
    url(r'remove_org/$', views.remove_orgs, name='remove_org'),
]
