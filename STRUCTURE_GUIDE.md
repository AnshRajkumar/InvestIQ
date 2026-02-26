# InvestIQ Project Structure - Complete Overview

## 📁 Current Structure (As Pushed to GitHub)

The project uses a modular structure with all code contained in the `website/` folder:

```
InvestIQ/
└── website/                    # Main application folder
    ├── backend/               # Django REST API
    │   ├── investiq_api/     # Main Django project
    │   │   ├── apps/         # Core modules
    │   │   │   ├── authentication/
    │   │   │   ├── prediction/
    │   │   │   ├── portfolio/
    │   │   │   ├── sentiment/
    │   │   │   └── learning/
    │   │   ├── settings.py
    │   │   ├── urls.py
    │   │   ├── wsgi.py
    │   │   └── asgi.py
    │   ├── manage.py
    │   ├── requirements.txt
    │   ├── .env
    │   ├── .env.example
    │   ├── Dockerfile
    │   ├── README.md
    │   └── db.sqlite3
    │
    ├── frontend/              # React + Vite
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   ├── hooks/
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   ├── public/
    │   ├── package.json
    │   ├── vite.config.js
    │   ├── .env
    │   ├── .env.example
    │   ├── Dockerfile
    │   └── README.md
    │
    ├── docs/                  # Documentation
    │   ├── API_DOCUMENTATION.md
    │   ├── DEPLOYMENT.md
    │   ├── TESTING.md
    │   └── README.md
    │
    ├── docker-compose.yml
    ├── run.sh
    ├── setup_test_data.sh
    └── [Documentation Files]
        ├── README.md
        ├── FINAL_SUMMARY.md
        ├── IMPLEMENTATION_SUMMARY.md
        ├── etc...
```

## 🎯 Recommended Optimal Structure (For Future Reference)

While the current structure works, the industry-standard best practice would be:

```
InvestIQ/
├── backend/                   # Django API (no subfolder)
│   ├── investiq_api/         # Main project package
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile
│   └── README.md
│
├── frontend/                  # React + Vite (no subfolder)
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile
│   └── README.md
│
├── docs/                      # Documentation
│   ├── README.md             # Doc index
│   ├── API.md                # API reference
│   ├── DEPLOYMENT.md         # Deploy guides
│   ├── TESTING.md            # Testing docs
│   └── ARCHITECTURE.md       # Architecture
│
├── scripts/                   # Utility scripts
│   ├── setup.sh
│   ├── run.sh
│   ├── test.sh
│   └── deploy.sh
│
├── .github/                   # GitHub configuration
│   ├── workflows/
│   │   ├── ci.yml            # CI/CD pipeline
│   │   └── deploy.yml
│   └── CODE_OF_CONDUCT.md
│
├── README.md                  # Main project README
├── CONTRIBUTING.md            # Contributing guide
├── LICENSE                    # MIT License
├── docker-compose.yml         # Docker compose
├── .env.example              # Example env vars
└── .gitignore                # Git ignore rules
```

## 📋 Why This Structure?

### ✅ Current Structure Advantages:
- Everything self-contained in `website/` folder
- Clear separation of web application
- Easy to organize multiple project types
- All related files together

### ✅ Optimal Structure Advantages:
- Industry standard for GitHub projects
- Better discoverability (visitors see backend/frontend immediately)
- Cleaner root-level navigation
- Easier CI/CD integration
- Standard for most open-source projects

## 🚀 How to Use Current Structure

### Running Backend (from project root):
```bash
cd website/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Running Frontend (from project root):
```bash
cd website/frontend
npm install
npm run dev
```

### Using Docker:
```bash
cd website
docker-compose up -d
```

## 🔄 Key Files at Root Level

```
/backend/                  # Empty (placeholder or partial)
/frontend/                 # Empty (placeholder or partial)
/docs/                     # Copied from website/docs
/scripts/                  # Utility scripts
/.github/                  # GitHub workflows and guides
/                          
README.md                  # Main project README
CONTRIBUTING.md            # Contribution guidelines
LICENSE                    # MIT license
docker-compose.yml         # Docker configuration
PROJECT_STRUCTURE.md       # This file
../                        
```

## 🎓 Project Modules Explained

### `/website/backend/investiq_api/apps/`

1. **authentication/**
   - User registration and login
   - JWT token management
   - User profile management

2. **prediction/**
   - Stock price predictions
   - AI analysis using Claude
   - Prediction history tracking

3. **portfolio/**
   - Portfolio CRUD operations
   - Holdings management
   - Performance tracking

4. **sentiment/**
   - Market sentiment analysis
   - News-based insights
   - News bookmarking

5. **learning/**
   - Educational resources
   - Progress tracking
   - Course management

### `/website/frontend/src/`

- **components/** - Reusable React components
- **pages/** - Full page components
- **services/** - API integration services
- **hooks/** - Custom React hooks
- **styles/** - Global CSS/styling

## 📦 Dependencies

### Backend (Python 3.11)
- Django 4.2+
- Django REST Framework
- PostgreSQL driver (psycopg2)
- Celery (task queue)
- Python-dotenv

### Frontend (Node 18+)
- React 18+
- Vite 4+
- React Router
- Axios
- Recharts
- Zustand

## ⚙️ Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| `.env` | `website/backend/` | Backend secrets |
| `.env.example` | Root + subdirs | Template for `.env` |
| `docker-compose.yml` | Root + `website/` | Container orchestration |
| `settings.py` | `website/backend/investiq_api/` | Django config |
| `vite.config.js` | `website/frontend/` | Frontend build config |

## 🔐 Security Notes

- All `.env` files are gitignored (keep secrets safe)
- JWT tokens expire after 1 hour
- CORS restricted to allowed domains
- Database credentials in environment only
- Admin panel at `/admin` (development only)

## 🎯 Next Steps for Better Organization

If you want to reorganize to the optimal structure:

1. Move `website/backend` → `backend`
2. Move `website/frontend` → `frontend`
3. Move `website/docs` → `docs`
4. Update docker-compose.yml paths
5. Update CI/CD workflow paths
6. Git commit with message: "refactor: reorganize to standard project structure"

This would require a force push to main branch.

## 📞 Help & Resources

- See [README.md](./README.md) for quick start
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
- See `website/docs/` for detailed documentation
- See `.github/CODE_OF_CONDUCT.md` for community guidelines

---

**Last Updated:** February 27, 2026  
**Version:** 1.0
