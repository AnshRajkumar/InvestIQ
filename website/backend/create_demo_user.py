import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investiq_api.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

email = 'john@example.com'
username = 'johndoe'
password = 'TestPass123!'

if User.objects.filter(email=email).exists():
    print(f"✅ User {email} already exists")
else:
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name='John',
        last_name='Doe',
        is_active=True
    )
    print(f"✅ Demo user created!")

print("\n📋 Users in database:")
for u in User.objects.all():
    print(f"   - {u.email} (active: {u.is_active})")
