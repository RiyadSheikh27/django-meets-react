from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class TaskImage(models.Model):
    task = models.ForeignKey(Task, related_name='images', on_delete=models.CASCADE)
    image = models.FileField(upload_to='tasks/')
