import base64
import binascii
import hashlib
import hmac
import json
import time
import uuid

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import RevokedRefreshToken


def _encode_segment(value):
    encoded = base64.urlsafe_b64encode(value).decode('ascii')
    return encoded.rstrip('=')


def _decode_segment(value):
    return base64.urlsafe_b64decode(value + '=' * (-len(value) % 4))


def _create_token(user, token_type, lifetime):
    header = _encode_segment(json.dumps(
        {'alg': 'HS256', 'typ': 'JWT'}, separators=(',', ':')
    ).encode())
    payload = _encode_segment(json.dumps({
        'sub': str(user.pk),
        'typ': token_type,
        'jti': str(uuid.uuid4()),
        'exp': int(time.time()) + lifetime,
    }, separators=(',', ':')).encode())
    unsigned_token = f'{header}.{payload}'
    signature = hmac.new(
        settings.SECRET_KEY.encode(),
        unsigned_token.encode(),
        hashlib.sha256,
    ).digest()
    return f'{unsigned_token}.{_encode_segment(signature)}'


def _read_refresh_token(token):
    try:
        header, payload, signature = token.split('.')
        unsigned_token = f'{header}.{payload}'
        expected_signature = hmac.new(
            settings.SECRET_KEY.encode(),
            unsigned_token.encode(),
            hashlib.sha256,
        ).digest()
        if not hmac.compare_digest(_decode_segment(signature), expected_signature):
            return None

        header_data = json.loads(_decode_segment(header))
        token_data = json.loads(_decode_segment(payload))
        if (
            header_data.get('alg') != 'HS256'
            or header_data.get('typ') != 'JWT'
            or token_data.get('typ') != 'refresh'
            or int(token_data.get('exp', 0)) <= int(time.time())
            or RevokedRefreshToken.objects.filter(jti=token_data.get('jti')).exists()
        ):
            return None
        return token_data
    except (
        AttributeError,
        binascii.Error,
        TypeError,
        ValueError,
        UnicodeDecodeError,
        json.JSONDecodeError,
    ):
        return None


def _invalid_token():
    return JsonResponse(
        {'detail': 'Token is invalid or expired.'},
        status=401,
    )


@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed.'}, status=405)
    try:
        data = json.loads(request.body or b'{}')
    except (json.JSONDecodeError, UnicodeDecodeError):
        data = {}
    if not isinstance(data, dict):
        data = {}

    user = authenticate(
        request,
        username=data.get('username'),
        password=data.get('password'),
    )
    if user is None:
        return JsonResponse(
            {'detail': 'Invalid username or password.'},
            status=401,
        )

    return JsonResponse({
        'full_name': user.get_full_name(),
        'username': user.get_username(),
        'access': _create_token(user, 'access', 15 * 60),
        'refresh': _create_token(user, 'refresh', 7 * 24 * 60 * 60),
    })


@csrf_exempt
def refresh_token(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed.'}, status=405)
    try:
        data = json.loads(request.body or b'{}')
    except (json.JSONDecodeError, UnicodeDecodeError):
        data = {}
    if not isinstance(data, dict):
        data = {}

    token_data = _read_refresh_token(data.get('refresh'))
    if token_data is None:
        return _invalid_token()

    user = get_user_model().objects.filter(
        pk=token_data.get('sub'),
        is_active=True,
    ).first()
    if user is None:
        return _invalid_token()

    RevokedRefreshToken.objects.create(jti=token_data['jti'])
    return JsonResponse({
        'access': _create_token(user, 'access', 15 * 60),
        'refresh': _create_token(user, 'refresh', 7 * 24 * 60 * 60),
    })


@csrf_exempt
def logout(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed.'}, status=405)
    try:
        data = json.loads(request.body or b'{}')
    except (json.JSONDecodeError, UnicodeDecodeError):
        data = {}
    if not isinstance(data, dict):
        data = {}

    token_data = _read_refresh_token(data.get('refresh'))
    if token_data is None:
        return _invalid_token()
    RevokedRefreshToken.objects.create(jti=token_data['jti'])
    return JsonResponse({'detail': 'Logged out successfully.'}, status=205)
