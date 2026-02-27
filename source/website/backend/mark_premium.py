#!/usr/bin/env python
"""Mark sunitpanda680@gmail.com as premium user."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investiq_api.settings')
django.setup()

from investiq_api.apps.authentication.models import User

try:
    user = User.objects.get(email='sunitpanda680@gmail.com')
    user.is_premium = True
    user.is_email_verified = True
    user.save()
    print(f"✅ User {user.email} marked as premium and verified!")
except User.DoesNotExist:
    print("❌ User with email sunitpanda680@gmail.com not found. Please create this account first.")
except Exception as e:
    print(f"❌ Error: {str(e)}")
