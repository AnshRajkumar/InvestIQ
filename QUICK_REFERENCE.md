# Quick Reference Guide

## Project Overview

Festronix is a full-stack AI-powered finance education and investment intelligence platform.

**Tech Stack:**

- Backend: Django REST Framework
- Frontend: React (Vite) - _to be created_
- Database: PostgreSQL (or SQLite for dev)
- AI: OpenAI or Google Gemini
- Deployment: Docker, Gunicorn, Nginx

## Backend Modules

### 1. Authentication (`apps/authentication/`)

**Purpose:** User registration, login, profile management

**Key Endpoints:**

- `POST /api/auth/login/` - User login
- `POST /api/auth/register/register/` - User registration
- `GET /api/auth/profile/me/` - Get current user
- `PUT /api/auth/profile/update_profile/` - Update profile

**Files:**

- `models.py` - Extended User model with profile fields
- `serializers.py` - JWT and user serializers
- `views.py` - Auth views and ViewSets
- `urls.py` - Authentication routes

### 2. Prediction (`apps/prediction/`)

**Purpose:** Stock prediction management and AI analysis

**Key Endpoints:**

- `POST /api/prediction/predictions/create_prediction/` - Make prediction
- `GET /api/prediction/predictions/my_predictions/` - Get user predictions
- `GET /api/prediction/predictions/stock_info/` - Get stock data
- `GET /api/prediction/predictions/prediction_stats/` - Get accuracy stats

**Features:**

- Simple Moving Average (SMA) calculations
- AI prediction generation
- Mock stock data provider
- Prediction accuracy tracking

**Files:**

- `models.py` - StockPrediction model
- `serializers.py` - Prediction serializers
- `views.py` - Prediction ViewSet
- `utils.py` - Mock data provider and AI predictor
- `urls.py` - Prediction routes

### 3. News Intelligence (`apps/news/`)

**Purpose:** Financial news aggregation and sentiment analysis

**Key Endpoints:**

- `GET /api/news/articles/all_news/` - Get news
- `GET /api/news/articles/by_sentiment/` - Filter by sentiment
- `GET /api/news/articles/market_sentiment/` - Get market mood
- `GET /api/news/bookmarks/my_bookmarks/` - Bookmarked articles

**Features:**

- Sentiment classification (positive/negative/neutral)
- Impact scoring
- Stock relevance mapping
- Mock news provider

**Files:**

- `models.py` - FinancialNews and NewsBookmark models
- `serializers.py` - News serializers
- `views.py` - News ViewSets
- `utils.py` - Mock news provider
- `urls.py` - News routes

### 4. Portfolio (`apps/portfolio/`)

**Purpose:** Portfolio management and performance tracking

**Key Endpoints:**

- `GET /api/portfolio/overview/` - Portfolio overview
- `POST /api/portfolio/add_holding/` - Add stock
- `GET /api/portfolio/holdings/` - List holdings
- `GET /api/portfolio/performance/` - Performance metrics
- `GET /api/portfolio/allocation_by_sector/` - Sector breakdown

**Features:**

- CRUD operations on holdings
- Profit/loss calculations
- Risk scoring
- Sector allocation analysis
- Cash management

**Files:**

- `models.py` - Portfolio and PortfolioHolding models
- `serializers.py` - Portfolio serializers
- `views.py` - Portfolio ViewSet
- `urls.py` - Portfolio routes

### 5. AI Strategy Advisor (`apps/advisor/`)

**Purpose:** AI-powered investment recommendations

**Key Endpoints:**

- `GET /api/advisor/get_recommendation/` - Get recommendation
- `GET /api/advisor/recommendations_history/` - Get history
- `POST /api/advisor/feedback/` - Submit feedback
- `GET /api/advisor/analysis_summary/` - Overall summary

**Features:**

- Aggregates portfolio, news, and predictions
- Generates tailored recommendations
- Confidence scoring
- Feedback mechanism
- OpenAI/Gemini integration ready

**Files:**

- `models.py` - AdvisorRecommendation model
- `serializers.py` - Recommendation serializers
- `views.py` - Advisor ViewSet
- `utils.py` - Prompt builder and AI strategy generator
- `urls.py` - Advisor routes

## Core Configuration Files

### `settings.py`

Main Django configuration:

- Database configuration
- Installed apps (5 custom + Django + REST Framework)
- JWT settings
- CORS configuration
- Static/Media file settings
- Logging configuration

### `urls.py`

Main URL routing:

- Health check endpoint
- API versioning namespace
- Admin interface
- Static/Media serving

### `wsgi.py` & `asgi.py`

Application entry points for:

- Production (Gunicorn)
- Development (Runserver)
- ASGI servers (optional)

### `.env` Configuration

Environment variables:

- `DEBUG` - Development mode
- `SECRET_KEY` - Django secret key
- `DATABASE_*` - Database configuration
- `CORS_ALLOWED_ORIGINS` - Frontend URL
- `JWT_*` - JWT configuration
- `OPENAI_API_KEY` / `GEMINI_API_KEY` - AI API keys
- `USE_MOCK_DATA` - Toggle mock data providers

## API Response Format

### Success Response (200/201)

```json
{
  "data": {...},
  "message": "Success message"
}
```

### Error Response (4xx/5xx)

```json
{
  "error": "Error description"
}
```

### Pagination

```json
{
  "count": 100,
  "page": 1,
  "page_size": 10,
  "results": [...]
}
```

## Common Tasks

### Add New Endpoint

1. **Create serializer** in `serializers.py`

```python
class NewSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewModel
        fields = [...]
```

2. **Create view/action** in `views.py`

```python
@action(detail=False, methods=['get'])
def new_endpoint(self, request):
    # Logic here
    return Response({...})
```

3. **Add route** in `urls.py`

```python
path('endpoint/', view_function_or_viewset)
```

### Create New App

1. Create folder in `festronix_api/apps/`
2. Create basic files:
   - `__init__.py`
   - `apps.py` (with AppConfig)
   - `models.py`
   - `serializers.py`
   - `views.py`
   - `urls.py`
3. Add to `INSTALLED_APPS` in settings
4. Create migrations: `python manage.py makemigrations`

### Run Migrations

```bash
# Create migration file
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Show migration status
python manage.py showmigrations
```

### Test API

```bash
# Using curl
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'

# Using HTTPie
http POST localhost:8000/api/auth/login/ \
  username=user password=pass

# Using Python
import requests
requests.post('http://localhost:8000/api/auth/login/',
  json={'username':'user','password':'pass'})
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
python manage.py runserver 8001
```

### Database Locked

```bash
# Reset database (WARNING: deletes all data)
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Missing Dependencies

```bash
pip install -r requirements.txt
pip list  # Verify installation
```

### Import Errors

```bash
# Ensure correct Python path
which python
echo $PYTHONPATH

# Reinstall in virtual environment
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## Next Steps

### Phase 1: Backend Completion ✅

- [x] Authentication module
- [x] Prediction module
- [x] News module
- [x] Portfolio module
- [x] Advisor module
- [x] Documentation

### Phase 2: Frontend Development 🔄

- [ ] React + Vite setup
- [ ] API service layer (Axios)
- [ ] Auth context/state management
- [ ] Dashboard page
- [ ] Prediction page
- [ ] Portfolio page
- [ ] Advisor page
- [ ] Components and styling

### Phase 3: Integration & Testing

- [ ] E2E testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing

### Phase 4: Deployment

- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Monitoring setup

## Important Notes

1. **Mock Data**: Currently using mock providers for stocks and news. Replace with real APIs when ready.

2. **AI Integration**: AI strategy recommendation is prepared but uses mock data by default. Configure OpenAI/Gemini keys to enable real recommendations.

3. **Authentication**: JWT tokens expire in 60 minutes by default. Refresh tokens valid for 7 days.

4. **CORS**: Configured for localhost:5173 (Vite default) and localhost:3000 (React default). Update in production.

5. **Static Files**: WhiteNoise is configured for efficient static file serving in production.

## Useful Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [JWT Authentication](https://django-rest-framework-simplejwt.readthedocs.io/)
- [OpenAI API](https://platform.openai.com/docs/)
- [Google Gemini](https://ai.google.dev/)

## Support & Documentation

- Main README: `/README.md`
- Backend Setup: `/backend/README.md`
- API Documentation: `/docs/API_DOCUMENTATION.md`
- Deployment Guide: `/docs/DEPLOYMENT.md`

---

**Last Updated:** February 26, 2026
**Version:** 1.0.0
**Status:** Backend Ready, Frontend Pending
