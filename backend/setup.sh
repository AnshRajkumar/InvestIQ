#!/bin/bash

# Festronix Backend Setup Script
# This script automates the backend setup process

set -e

echo "🚀 Festronix Backend Setup"
echo "=========================="

# Check Python version
python_version=$(python3 --version 2>&1)
echo "✓ Found: $python_version"

# Create virtual environment
echo ""
echo "📦 Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment
echo ""
echo "🔧 Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated"

# Install requirements
echo ""
echo "📚 Installing dependencies..."
pip install -r requirements.txt
echo "✓ Dependencies installed"

# Copy environment file if it doesn't exist
echo ""
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created from template"
    echo "⚠️  Please edit .env with your configuration"
else
    echo "✓ .env file already exists"
fi

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
python manage.py migrate
echo "✓ Database migrations completed"

# Collect static files
echo ""
echo "📦 Collecting static files..."
python manage.py collectstatic --noinput
echo "✓ Static files collected"

# Create superuser
echo ""
echo "👤 Creating superuser..."
echo "If you want to skip superuser creation, press Ctrl+C"
sleep 2
python manage.py createsuperuser
echo "✓ Superuser created"

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Run development server: python manage.py runserver"
echo "3. Access admin: http://localhost:8000/admin"
echo "4. API root: http://localhost:8000/api/"
echo ""
