from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls import url

from . import views

app_name = 'table'

urlpatterns = [
    re_path(r'^encounters/$', views.encounters),
    re_path(r'^encounters/upload$', views.EncounterUpload.as_view()),
    re_path(r'^encounters/users$', views.CreateUser.as_view())
]
