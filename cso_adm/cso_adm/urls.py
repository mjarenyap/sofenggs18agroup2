"""cso_adm URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include, handler404
from django.contrib import admin

from page_404 import views

# This file maps all top-level urls to their respective web pages
# These url patterns are based on the sitemap (c) Julianne Tan

urlpatterns = [
    # Root path
    # When accessing only the domain name, redirect to this path


    # [Dashboard]
    # This app provides a summary of the most relevant details which
    # the user wants to see like impending deadlines for orgs, post-act status, etc...
    url("^", include('dashboard.urls')),

    # [Administrator]
    # This app gives access to administrative privileges like accessing the database, etc...
    url(r'^admin/', admin.site.urls),

    # [Organization list]
    # This app provides access to each registered organization
    url(r'^organization-list/', include('org_list.urls')),

    # [Settings]
    # This app provides users with configuration options
    # url(r'^settings/', include('page_settings.urls')),

    # [404 page]
    # This app is prompted in case users attempt to access non-existing pages
    # todo contruct invalid expression for this app
    url(r'^page-not-found/', include('page_404.urls')),

    # [Login]
    # This app provides a facility for the user to login
    # url(r'^login/', include('login.urls')),

    # [Logout]
    # This app provides a facility for the user to logout
    # url(r'^logout/', include('logout.urls')),
]
