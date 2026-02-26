# InvestIQ - AI-Powered Investment Intelligence Platform

A full-stack platform for financial education and investment intelligence powered by AI.

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+ (or SQLite for development)
- Virtual environment tool (venv or conda)

### Backend Setup

1. **Create Virtual Environment**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**

   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Database Setup**

   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Create React App**

   ```bash
   cd frontend
   npm create vite@latest . -- --template react
   npm install
   ```

2. **Install Dependencies**

   ```bash
   npm install axios react-router-dom zustand recharts
   ```

3. **Configure API**
   Create `.env` file in frontend root:

   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

Frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
Festronix/
├── backend/
│   ├── investiq_api/
│   │   ├── apps/
│   │   │   ├── authentication/    # JWT auth, user profiles
│   │   │   ├── prediction/        # Stock prediction logic
│   │   │   ├── news/             # Financial news intelligence
│   │   │   ├── portfolio/        # Portfolio management
│   │   │   └── advisor/          # AI strategy advisor
│   │   ├── settings.py           # Django configuration
│   │   ├── urls.py               # API routes
│   │   └── wsgi.py               # Production entry point
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── context/             # Auth context
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── docs/
    └── API_DOCUMENTATION.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login/` - Login
- `POST /api/auth/refresh/` - Refresh token
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/register/register/` - Register
- `GET /api/auth/profile/me/` - Get profile
- `PUT /api/auth/profile/update_profile/` - Update profile

### Predictions

- `POST /api/prediction/predictions/create_prediction/` - Create prediction
- `GET /api/prediction/predictions/my_predictions/` - Get predictions
- `GET /api/prediction/predictions/prediction_stats/` - Get statistics
- `GET /api/prediction/predictions/stock_info/` - Get stock info
- `GET /api/prediction/predictions/trending_stocks/` - Trending stocks

### News

- `GET /api/news/articles/all_news/` - Get all news
- `GET /api/news/articles/trending/` - Trending news
- `GET /api/news/articles/by_sentiment/` - Filter by sentiment
- `GET /api/news/articles/by_stock/` - News by stock
- `GET /api/news/articles/market_sentiment/` - Market sentiment
- `GET /api/news/bookmarks/my_bookmarks/` - My bookmarks

### Portfolio

- `GET /api/portfolio/overview/` - Portfolio overview
- `POST /api/portfolio/add_holding/` - Add holding
- `GET /api/portfolio/holdings/` - Get holdings
- `DELETE /api/portfolio/remove_holding/` - Remove holding
- `GET /api/portfolio/performance/` - Performance metrics
- `GET /api/portfolio/allocation_by_sector/` - Sector allocation

### Advisor

- `GET /api/advisor/get_recommendation/` - Get AI recommendation
- `GET /api/advisor/recommendations_history/` - Recommendation history
- `POST /api/advisor/feedback/` - Submit feedback
- `GET /api/advisor/analysis_summary/` - Analysis summary

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include token in requests:

```
Authorization: Bearer <your_token>
```

## 🤖 AI Integration

### Supported Providers

- **OpenAI** - GPT-3.5 Turbo
- **Google Gemini** - Generative AI

### Configuration

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_key
GEMINI_API_KEY=your_key
```

## 📊 Features

### 1. Stock Prediction

- User predictions with AI validation
- Technical analysis (SMA-50, SMA-200)
- Confidence scoring
- Historical tracking

### 2. News Intelligence

- Real-time financial news
- Sentiment analysis
- Impact scoring
- Stock relevance mapping
- Bookmark feature

### 3. Portfolio Management

- CRUD operations on holdings
- Profit/loss tracking
- Risk assessment
- Sector allocation
- Performance analytics

### 4. AI Strategy Advisor

- Aggregated insights
- Personalized recommendations
- Portfolio analysis
- Risk management
- Actionable recommendations

## 🛠️ Development

### Running Tests

```bash
python manage.py test
```

### Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Static Files

```bash
python manage.py collectstatic
```

### Create Admin User

```bash
python manage.py createsuperuser
```

## 📦 Deployment

### Using Gunicorn

```bash
gunicorn investiq_api.wsgi:application --bind 0.0.0.0:8000
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

- `DEBUG=False`
- `SECRET_KEY` - Generate a strong key
- `DATABASE_ENGINE` - PostgreSQL recommended
- `AI_PROVIDER` - Choose openai or gemini

### Docker (Optional)

```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "investiq_api.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## 🧠 Architecture

- **Frontend**: React (Vite) - Modern UI with real-time updates
- **Backend**: Django REST Framework - RESTful API
- **Database**: PostgreSQL - Production, SQLite - Development
- **AI**: OpenAI/Gemini - Strategy generation
- **Authentication**: JWT - Stateless security
- **Storage**: WhiteNoise - Static file serving

## 🤝 Contributing

1. Create a feature branch
2. Commit changes
3. Push to branch
4. Open a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please open an issue in the repository.

## 🔗 Links

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Frontend Setup](./frontend/README.md)
- [Backend Setup](./backend/README.md)
