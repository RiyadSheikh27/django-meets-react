from django.db import models


class RevokedRefreshToken(models.Model):
    jti = models.CharField(max_length=36, unique=True)
    revoked_at = models.DateTimeField(auto_now_add=True)
