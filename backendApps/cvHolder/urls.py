from django.urls import path
from backendApps.cvHolder import views

urlpatterns = [
    path("cv-form-upload/", views.cv_form_upload),
    path("cv-list/", views.cv_list),
]