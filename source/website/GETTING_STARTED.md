# 🚀 InvestIQ - Complete Full Stack Application

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.12+
- Docker & Docker Compose (optional)

## Option 1: Local Development

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs on: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Option 2: Docker Compose

Run both backend and frontend with one command:

```bash
docker-compose up --build
```

Services:

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

## Usage

1. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Admin Panel: `http://localhost:8000/admin`

2. **Login**
   - Email: `admin@example.com`
   - Password: `admin123`

3. **Or Register**
   - Create new account at `/register`
   - Fill in experience level and risk tolerance

## API Endpoints

### Authentication

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login and get JWT token
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/me/` - Get current user profile
- `PUT /api/auth/profile/update/` - Update profile
- `POST /api/auth/change-password/` - Change password

### Predictions

- `POST /api/prediction/create/` - Create stock prediction
- `GET /api/prediction/my-predictions/` - Get user's predictions
- `GET /api/prediction/stats/` - Get prediction statistics
- `GET /api/prediction/stock-info/` - Get stock analysis

### News

- `GET /api/news/` - Get all news
- `GET /api/news/trending/` - Get trending news
- `GET /api/news/by-sentiment/` - Filter by sentiment
- `GET /api/news/bookmarks/` - Get bookmarked articles

### Portfolio

- `GET /api/portfolio/overview/` - Get portfolio summary
- `POST /api/portfolio/add_holding/` - Add stock
- `GET /api/portfolio/holdings/` - Get all holdings
- `DELETE /api/portfolio/remove_holding/` - Remove stock
- `GET /api/portfolio/performance/` - Get performance metrics

### Advisor

- `POST /api/advisor/recommendation/` - Get AI recommendation
- `GET /api/advisor/history/` - Get recommendation history
- `POST /api/advisor/feedback/` - Submit feedback on recommendation
- `GET /api/advisor/summary/` - Get analysis summary

### Health

- `GET /api/health/` - System health check

## Technology Stack

### Backend

- **Django 4.2.9** - Web framework
- **Django REST Framework 3.14.0** - REST API
- **djangorestframework-simplejwt 5.3.1** - JWT authentication
- **PostgreSQL/SQLite** - Database
- **Gunicorn** - WSGI server

### Frontend

- **React 18.2.0** - UI library
- **Vite 5.0** - Build tool
- **React Router 6.20** - Routing
- **Axios 1.6** - HTTP client
- **Tailwind CSS 3.4** - Styling

## Project Structure

```
Festronix/
├── backend/
│   ├── venv/
│   ├── investiq_api/
│   │   ├── apps/
│   │   │   ├── authentication/
│   │   │   ├── prediction/
│   │   │   ├── news/
│   │   │   ├── portfolio/
│   │   │   └── advisor/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml
├── INDEX.md
└── ...
```

## Troubleshooting

### Backend Issues

- **Port 8000 already in use**: `lsof -i :8000` then kill the process
- **Database migration errors**: Delete `db.sqlite3` and run migrations again
- **Import errors**: Ensure virtual environment is activated and dependencies installed

### Frontend Issues

- **Port 5173 already in use**: Kill the process or use different port
- **API connection errors**: Check VITE_API_URL in `.env`
- **Blank page**: Check browser console for errors

### Docker Issues

- **Containers won't start**: `docker-compose logs` to see errors
- **Port conflicts**: Change port mappings in `docker-compose.yml`
- **Build failures**: `docker-compose down -v` then `docker-compose up --build`

## Development

### Add New Feature

1. **Backend**

   ```bash
   # Create model in apps/xxx/models.py
   # Create serializer in apps/xxx/serializers.py
   # Create view in apps/xxx/views.py
   # Add URL in apps/xxx/urls.py
   # Create migration: python manage.py makemigrations
   # Run migration: python manage.py migrate
   ```

2. **Frontend**
   ```bash
   # Create component in src/components/
   # Create page in src/pages/
   # Add route in src/App.jsx
   # Use API service: import api from '../services/api'
   ```

## Deployment

### Production Checklist

- [ ] Set `DEBUG=False` in backend `.env`
- [ ] Generate new `SECRET_KEY`
- [ ] Configure database (PostgreSQL)
- [ ] Setup environment variables
- [ ] Build frontend: `npm run build`
- [ ] Collect static files: `python manage.py collectstatic`
- [ ] Use Gunicorn or similar for production server
- [ ] Setup HTTPS/SSL certificate
- [ ] Configure CORS for frontend domain
- [ ] Setup monitoring and logging

### Docker Production Deployment

```bash
docker-compose -f docker-compose.yml up -d
```

## Support

- Backend docs: See `backend/README.md`
- API docs: See `docs/API_DOCUMENTATION.md`
- Deployment guide: See `docs/DEPLOYMENT.md`
- Testing guide: See `docs/TESTING.md`

---

**Status**: ✅ Full stack ready for development and deployment

**Last Updated**: February 26, 2026
