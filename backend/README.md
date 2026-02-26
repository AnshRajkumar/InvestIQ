# Backend Setup Instructions

## Quick Start

### 1. Setup Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
# At minimum, set:
# - DEBUG=True (for development)
# - SECRET_KEY (generate a strong key)
# - DATABASE settings (defaults to SQLite)
# - CORS_ALLOWED_ORIGINS (for frontend)
```

### 4. Database Setup

```bash
# Run migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser

# Load sample data (optional)
python manage.py loaddata sample_data.json
```

### 5. Run Development Server

```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000`

## Project Structure

```
backend/
├── investiq_api/
│   ├── apps/
│   │   ├── authentication/
│   │   │   ├── models.py          # User model
│   │   │   ├── serializers.py     # Serializers
│   │   │   ├── views.py           # API views
│   │   │   ├── urls.py            # Routes
│   │   │   └── apps.py            # App config
│   │   ├── prediction/
│   │   ├── news/
│   │   ├── portfolio/
│   │   └── advisor/
│   ├── settings.py                # Django settings
│   ├── urls.py                    # Main URL configuration
│   ├── wsgi.py                    # WSGI application
│   └── asgi.py                    # ASGI application
├── manage.py
├── requirements.txt
└── .env.example
```

## API Endpoints Overview

### Authentication

```
POST   /api/auth/login/                    - Login
POST   /api/auth/refresh/                  - Refresh token
POST   /api/auth/logout/                   - Logout
POST   /api/auth/register/register/        - Register new user
GET    /api/auth/profile/me/               - Get current user
PUT    /api/auth/profile/update_profile/   - Update profile
POST   /api/auth/profile/change_password/  - Change password
```

### Stock Prediction

```
POST   /api/prediction/predictions/create_prediction/       - Create prediction
GET    /api/prediction/predictions/my_predictions/          - Get my predictions
GET    /api/prediction/predictions/prediction_stats/        - Get statistics
GET    /api/prediction/predictions/stock_info/              - Get stock info
GET    /api/prediction/predictions/trending_stocks/         - Trending stocks
```

### Financial News

```
GET    /api/news/articles/all_news/        - Get all news
GET    /api/news/articles/trending/        - Trending news
GET    /api/news/articles/by_sentiment/    - Filter by sentiment
GET    /api/news/articles/by_stock/        - News by stock
GET    /api/news/articles/market_sentiment/ - Market sentiment
```

### Portfolio

```
GET    /api/portfolio/overview/            - Portfolio overview
POST   /api/portfolio/add_holding/         - Add stock holding
GET    /api/portfolio/holdings/            - Get all holdings
DELETE /api/portfolio/remove_holding/      - Remove holding
GET    /api/portfolio/performance/         - Performance metrics
GET    /api/portfolio/allocation_by_sector/ - Sector allocation
POST   /api/portfolio/update_cash/         - Update cash
```

### AI Advisor

```
GET    /api/advisor/get_recommendation/    - Get AI recommendation
GET    /api/advisor/recommendations_history/ - Recommendation history
POST   /api/advisor/feedback/              - Submit feedback
GET    /api/advisor/analysis_summary/      - Analysis summary
```

## Testing the API

### Using curl

```bash
# Register a user
curl -X POST http://localhost:8000/api/auth/register/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"SecurePass123","password_confirm":"SecurePass123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"SecurePass123"}'

# Get portfolio (with token)
curl -X GET http://localhost:8000/api/portfolio/overview/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Python requests

```python
import requests

BASE_URL = "http://localhost:8000/api"

# Register
response = requests.post(f"{BASE_URL}/auth/register/register/", json={
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123",
    "password_confirm": "SecurePass123"
})
print(response.json())

# Login
response = requests.post(f"{BASE_URL}/auth/login/", json={
    "username": "testuser",
    "password": "SecurePass123"
})
tokens = response.json()
print(tokens)

# Get portfolio with token
headers = {"Authorization": f"Bearer {tokens['access']}"}
response = requests.get(f"{BASE_URL}/portfolio/overview/", headers=headers)
print(response.json())
```

## Database Options

### SQLite (Default - Development)

No additional setup needed. Database is `db.sqlite3` in project root.

### PostgreSQL (Production)

1. Install PostgreSQL
2. Create database and user:

```sql
CREATE DATABASE investiq_db;
CREATE USER investiq WITH PASSWORD 'password';
ALTER ROLE investiq SET client_encoding TO 'utf8';
ALTER ROLE investiq SET default_transaction_isolation TO 'read committed';
ALTER ROLE investiq SET default_transaction_deferrable TO on;
ALTER ROLE investiq SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE investiq_db TO investiq;
```

3. Update `.env`:

```env
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=festronix_db
DATABASE_USER=festronix
DATABASE_PASSWORD=password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

4. Run migrations:

```bash
python manage.py migrate
```

## Configuration Files

### settings.py

- Django configuration
- Database setup
- Installed apps
- Middleware
- REST framework settings
- JWT configuration

### .env (Required)

Copy from `.env.example` and set your values:

```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_ENGINE=django.db.backends.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
OPENAI_API_KEY=your-key
AI_PROVIDER=openai
```

## Common Commands

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Run tests
python manage.py test

# Shell access
python manage.py shell

# Check deployment
python manage.py check --deploy
```

## Troubleshooting

### ModuleNotFoundError

- Ensure virtual environment is activated
- Ensure all dependencies are installed: `pip install -r requirements.txt`

### Database Errors

- Run migrations: `python manage.py migrate`
- Check database connection in `.env`

### CORS Errors

- Update `CORS_ALLOWED_ORIGINS` in `.env` or `settings.py`
- Restart development server

### Port Already in Use

- Run on different port: `python manage.py runserver 8001`
- Or kill process: `lsof -ti:8000 | xargs kill -9`

## Next Steps

1. Start the frontend development server
2. Test API endpoints with the frontend
3. Configure AI API keys for real predictions
4. Deploy to production

For production deployment, see Docker setup and Gunicorn configuration in main README.
