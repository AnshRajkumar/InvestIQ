#!/bin/bash

# Script to setup test data for InvestIQ
# Run this after migrations are applied

echo "Setting up test data for InvestIQ..."
echo ""

# Navigate to backend directory
cd backend

# Create superuser and test accounts using Django shell
python manage.py shell << EOF
from django.contrib.auth import get_user_model
from investiq_api.apps.authentication.models import UserProgress

User = get_user_model()

# Create test user if doesn't exist
test_user_email = 'john@example.com'
test_user_username = 'johndoe'

if not User.objects.filter(email=test_user_email).exists():
    print(f"Creating test user: {test_user_email}")
    user = User.objects.create_user(
        username=test_user_username,
        email=test_user_email,
        password='TestPass123!',
        first_name='John',
        last_name='Doe',
        experience_level='beginner',
        risk_tolerance='medium'
    )
    
    # Create progress tracking
    progress = UserProgress.objects.create(user=user)
    print(f"✓ Test user created successfully!")
    print(f"  Email: {test_user_email}")
    print(f"  Username: {test_user_username}")
    print(f"  Password: TestPass123!")
else:
    print(f"✓ Test user already exists: {test_user_email}")

# List all users
print("\nExisting users:")
for user in User.objects.all():
    print(f"  - {user.email} ({user.username})")

EOF

echo ""
echo "Test data setup complete!"
echo ""
echo "You can now login with:"
echo "  Email: john@example.com"
echo "  Password: TestPass123!"
