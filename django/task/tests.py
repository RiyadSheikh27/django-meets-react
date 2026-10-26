import json

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from .models import Task


class TaskApiTests(TestCase):
    def test_list_filters_and_returns_only_list_fields(self):
        undone_task = Task.objects.create(title='Buy groceries')
        done_task = Task.objects.create(title='Finish lesson', is_done=True)

        response = self.client.get('/tasks/?status=undone&page=1')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            'count': 1,
            'next': None,
            'previous': None,
            'results': [{
                'id': undone_task.id,
                'title': 'Buy groceries',
                'is_done': False,
            }],
        })
        self.assertEqual(done_task.title, 'Finish lesson')

    def test_create_patch_add_and_delete_images_and_delete_task(self):
        image = SimpleUploadedFile('grocery.jpg', b'image data', content_type='image/jpeg')
        response = self.client.post(
            '/tasks/',
            {'title': 'Buy groceries', 'description': 'Milk and eggs', 'images': [image]},
        )
        self.assertEqual(response.status_code, 201)
        task_id = response.json()['id']
        self.assertEqual(response.json()['images'][0]['id'], 1)

        response = self.client.patch(
            f'/tasks/{task_id}/',
            data=json.dumps({'is_done': True}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['is_done'])
        self.assertEqual(response.json()['description'], 'Milk and eggs')

        second_image = SimpleUploadedFile('note.jpg', b'image data', content_type='image/jpeg')
        response = self.client.post(
            f'/tasks/{task_id}/images/',
            {'images[]': [second_image]},
        )
        self.assertEqual(response.status_code, 201)
        image_id = response.json()['images'][0]['id']

        response = self.client.delete(f'/tasks/{task_id}/images/{image_id}/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.content, b'')

        response = self.client.get(f'/tasks/{task_id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['images']), 1)

        response = self.client.delete(f'/tasks/{task_id}/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.content, b'')
        self.assertFalse(Task.objects.filter(pk=task_id).exists())

    def test_missing_title_and_unknown_task_responses(self):
        response = self.client.post('/tasks/', {'description': 'Missing title'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'title': ['This field is required.']})

        response = self.client.get('/tasks/999/')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {'detail': 'Not found.'})
