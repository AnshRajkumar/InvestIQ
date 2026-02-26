#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investiq_api.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

emails_to_delete = ['work.sunitpanda@gmail.com']

for email in emails_to_delete:
    users = User.objects.filter(email=email)
    count = users.count()
    if count > 0:
        users.delete()
        print(f"✓ Deleted {count} user(s) with email: {email}")
    else:
        print(f"✗ No users found with email: {email}")

print("\nRemaining users:")
remaining = User.objects.all().values('email', 'username')
for user in remaining:
    print(f"  - {user['email']} ({user['username']})")
