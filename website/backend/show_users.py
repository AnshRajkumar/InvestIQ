#!/usr/bin/env python
import os
import sys
import django

sys.path.insert(0, '/Users/sunitpanda/Develop/Hackathon/Festronix/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investiq_api.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print('=' * 60)
print('USER DATABASE - All Users')
print('=' * 60)

for user in User.objects.all():
    print(f'\n📧 Email: {user.email}')
    print(f'   Username: {user.username}')
    print(f'   Name: {user.first_name} {user.last_name}')
    print(f'   Is Superuser (Admin): {user.is_superuser}')
    print(f'   Is Staff: {user.is_staff}')
    print(f'   Is Active: {user.is_active}')
    print(f'   Experience: {user.experience_level}')
    print(f'   Risk Tolerance: {user.risk_tolerance}')
    print(f'   Created: {user.created_at}')

print('\n' + '=' * 60)
print(f'Total Users: {User.objects.count()}')
print(f'Admin Users: {User.objects.filter(is_superuser=True).count()}')
print(f'Regular Users: {User.objects.filter(is_superuser=False).count()}')
print('=' * 60)

print('\n📍 Database Location:')
print('   /Users/sunitpanda/Develop/Hackathon/Festronix/backend/db.sqlite3')
