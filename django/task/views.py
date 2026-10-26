import json
from datetime import timezone as datetime_timezone

from django.core.paginator import Paginator
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .models import Task, TaskImage


def _json_body(request):
    try:
        return json.loads(request.body or b'{}')
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


def _timestamp(value):
    return value.astimezone(datetime_timezone.utc).isoformat().replace('+00:00', 'Z')


def _image_data(request, image):
    return {
        'id': image.id,
        'url': request.build_absolute_uri(image.image.url),
    }


def _task_data(request, task):
    return {
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'is_done': task.is_done,
        'images': [_image_data(request, image) for image in task.images.all()],
        'created_at': _timestamp(task.created_at),
        'updated_at': _timestamp(task.updated_at),
    }


def _upload_images(request, task, field_name='images'):
    uploaded_images = request.FILES.getlist(field_name)
    if field_name == 'images':
        uploaded_images += request.FILES.getlist('images[]')
    return [TaskImage.objects.create(task=task, image=image) for image in uploaded_images]


@csrf_exempt
def task_list(request):
    if request.method == 'GET':
        tasks = Task.objects.all().order_by('id')
        status = request.GET.get('status', 'all')
        if status == 'done':
            tasks = tasks.filter(is_done=True)
        elif status == 'undone':
            tasks = tasks.filter(is_done=False)
        elif status != 'all':
            return JsonResponse(
                {'status': ['Select a valid choice.']},
                status=400,
            )

        page = Paginator(tasks, 10).get_page(request.GET.get('page', 1))
        return JsonResponse({
            'count': page.paginator.count,
            'next': page.next_page_number() if page.has_next() else None,
            'previous': page.previous_page_number() if page.has_previous() else None,
            'results': [
                {'id': task.id, 'title': task.title, 'is_done': task.is_done}
                for task in page.object_list
            ],
        })

    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        if not title:
            return JsonResponse({'title': ['This field is required.']}, status=400)
        task = Task.objects.create(
            title=title,
            description=request.POST.get('description', ''),
        )
        _upload_images(request, task)
        return JsonResponse(_task_data(request, task), status=201)

    return JsonResponse({'detail': 'Method not allowed.'}, status=405)


@csrf_exempt
def task_detail(request, task_id):
    try:
        task = get_object_or_404(Task.objects.prefetch_related('images'), pk=task_id)
    except Http404:
        return JsonResponse({'detail': 'Not found.'}, status=404)

    if request.method == 'GET':
        return JsonResponse(_task_data(request, task))

    if request.method == 'PATCH':
        data = _json_body(request)
        if not isinstance(data, dict):
            return JsonResponse({'detail': 'Invalid JSON.'}, status=400)

        if 'title' in data:
            title = data['title']
            if not isinstance(title, str) or not title.strip():
                return JsonResponse({'title': ['This field is required.']}, status=400)
            task.title = title.strip()
        if 'description' in data:
            if not isinstance(data['description'], str):
                return JsonResponse(
                    {'description': ['Not a valid string.']},
                    status=400,
                )
            task.description = data['description']
        if 'is_done' in data:
            if not isinstance(data['is_done'], bool):
                return JsonResponse(
                    {'is_done': ['Must be a valid boolean.']},
                    status=400,
                )
            task.is_done = data['is_done']
        task.updated_at = timezone.now()
        task.save()
        return JsonResponse(_task_data(request, task))

    if request.method == 'DELETE':
        for image in task.images.all():
            image.image.delete(save=False)
        task.delete()
        return HttpResponse(status=204)

    return JsonResponse({'detail': 'Method not allowed.'}, status=405)


@csrf_exempt
def task_images(request, task_id):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed.'}, status=405)

    try:
        task = get_object_or_404(Task, pk=task_id)
    except Http404:
        return JsonResponse({'detail': 'Not found.'}, status=404)
    images = _upload_images(request, task)
    return JsonResponse(
        {'images': [_image_data(request, image) for image in images]},
        status=201,
    )


@csrf_exempt
def task_image_detail(request, task_id, image_id):
    if request.method != 'DELETE':
        return JsonResponse({'detail': 'Method not allowed.'}, status=405)

    try:
        image = get_object_or_404(TaskImage, task_id=task_id, pk=image_id)
    except Http404:
        return JsonResponse({'detail': 'Not found.'}, status=404)
    image.image.delete(save=False)
    image.delete()
    return HttpResponse(status=204)
