from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('token/refresh/', views.refresh_token, name='token-refresh'),
    path('logout/', views.logout, name='logout'),
]
