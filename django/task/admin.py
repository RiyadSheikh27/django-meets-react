from django.contrib import admin

from .models import Task, TaskImage


class TaskImageInline(admin.TabularInline):
    model = TaskImage
    extra = 0


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'is_done', 'created_at', 'updated_at')
    list_filter = ('is_done', 'created_at')
    search_fields = ('title', 'description')
    inlines = (TaskImageInline,)


@admin.register(TaskImage)
class TaskImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'task', 'image')
    search_fields = ('task__title',)
