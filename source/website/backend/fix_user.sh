#!/bin/bash
/Users/sunitpanda/Develop/Hackathon/Festronix/backend/venv/bin/python manage.py shell << 'DJANGO'
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(email='john@example.com')
user.set_password('TestPass123!')
user.save()
print("✅ Password reset successfully!")
print(f"Login with: {user.email} / TestPass123!")
DJANGO
