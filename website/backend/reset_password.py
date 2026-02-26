#!/usr/bin/env python
import os
import sys
import django

# Add backend to path
sys.path.insert(0, '/Users/sunitpanda/Develop/Hackathon/Festronix/backend')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investiq_api.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

try:
    user = User.objects.get(email='john@example.com')
    user.set_password('TestPass123!')
    user.save()
    print("✅ Password reset successfully!")
    print(f"Login with: {user.email} / TestPass123!")
except User.DoesNotExist:
    print("❌ User not found")
except Exception as e:
    print(f"❌ Error: {e}")
