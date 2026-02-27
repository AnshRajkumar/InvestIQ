from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model with email-based authentication."""
    email = models.EmailField(unique=True)
    google_id = models.CharField(max_length=500, blank=True, null=True, unique=True)
    is_email_verified = models.BooleanField(default=False)
    profile_picture = models.URLField(blank=True, null=True)
    is_premium = models.BooleanField(default=False)
    premium_since = models.DateTimeField(blank=True, null=True)
    premium_until = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'auth_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email
