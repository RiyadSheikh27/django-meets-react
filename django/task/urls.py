from django.urls import path

from . import views

urlpatterns = [
    path('', views.task_list, name='task-list'),
    path('<int:task_id>/', views.task_detail, name='task-detail'),
    path('<int:task_id>/images/', views.task_images, name='task-images'),
    path(
        '<int:task_id>/images/<int:image_id>/',
        views.task_image_detail,
        name='task-image-detail',
    ),
]
