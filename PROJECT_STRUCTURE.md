# Project Structure

```
InvestIQ/
├── 📁 backend/
│   ├── investiq_api/           # Main Django project package
│   │   ├── apps/               # Core application modules
│   │   │   ├── authentication/ # User auth & profiles
│   │   │   ├── prediction/     # Stock prediction
│   │   │   ├── portfolio/      # Portfolio management
│   │   │   ├── sentiment/      # Sentiment analysis
│   │   │   └── learning/       # Learning modules
│   │   ├── settings.py         # Django configurations
│   │   ├── urls.py             # URL routing
│   │   ├── asgi.py             # ASGI config
│   │   └── wsgi.py             # WSGI config
│   ├── manage.py               # Django CLI
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Example environment variables
│   ├── Dockerfile              # Docker container config
│   └── README.md               # Backend documentation
│
├── 📁 frontend/
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── hooks/              # Custom React hooks
│   │   ├── styles/             # Global styles
│   │   ├── App.jsx             # Root component
│   │   └── main.jsx            # Entry point
│   ├── public/                 # Static assets
│   ├── package.json            # Node.js dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── .env.example            # Example environment variables
│   ├── Dockerfile              # Docker container config
│   └── README.md               # Frontend documentation
│
├── 📁 docs/
│   ├── README.md               # Documentation index
│   ├── API.md                  # API endpoints & examples
│   ├── DEPLOYMENT.md           # Deployment guides
│   ├── TESTING.md              # Testing procedures
│   ├── ARCHITECTURE.md         # System architecture
│   └── CONTRIBUTING.md         # Contribution guidelines
│
├── 📁 scripts/
│   ├── run.sh                  # Start development environment
│   ├── setup.sh                # Initial setup script
│   ├── test.sh                 # Run all tests
│   └── deploy.sh               # Deployment script
│
├── 📁 .github/
│   ├── workflows/
│   │   ├── ci.yml              # CI/CD pipeline
│   │   └── deploy.yml          # Deployment workflow
│   └── CODE_OF_CONDUCT.md      # Community guidelines
│
├── 🐳 docker-compose.yml       # Docker compose configuration
├── 📄 README.md                # Main project README
├── 📄 .gitignore               # Git ignore rules
├── 📄 .env.example             # Example root env vars
├── 📄 LICENSE                  # Project license
└── 📄 CONTRIBUTING.md          # How to contribute
```

## Folder Descriptions

### `/backend`

Django REST API for financial analysis, predictions, and portfolio management.

- Handles all business logic and data persistence
- Provides REST endpoints for frontend
- Integrates with AI models and external APIs

### `/frontend`

React/Vite web application for user interface.

- Modern, responsive UI
- Real-time data visualization
- User authentication and profile management

### `/docs`

Comprehensive documentation for developers and users.

- API documentation with examples
- Deployment and setup guides
- Architecture and design decisions
- Testing procedures

### `/scripts`

Utility scripts for development and deployment.

- Environment setup
- Running development server
- Testing and deployment automation

### `/.github`

GitHub-specific configurations and workflows.

- CI/CD pipelines
- Community guidelines
- Issue and PR templates

## How to use this structure

1. Always keep related code together (don't spread it across folders)
2. Backend logic stays in `backend/investiq_api/apps/`
3. Frontend components stay in `frontend/src/`
4. Documentation stays in `docs/`
5. Configuration files at root for easy access
