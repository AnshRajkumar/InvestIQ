# InvestIQ Frontend

React + Vite frontend for the InvestIQ AI-powered investment intelligence platform.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Server runs on `http://localhost:5173`

## Build

```bash
npm run build
```

## Features

- 🔐 User authentication (login/register)
- 📊 Dashboard with portfolio overview
- 🎯 Stock prediction system
- 💼 Portfolio management
- 📰 Financial news feed
- 🤖 AI strategy advisor

## Configuration

Copy `.env.example` to `.env` and update:

```
VITE_API_URL=http://localhost:8000/api
```

## API Integration

The frontend connects to the Django REST API backend. Ensure the backend is running on `http://localhost:8000` before starting the frontend.

## Authentication

- JWT tokens stored in localStorage
- Automatic token refresh on expiry
- Protected routes for authenticated users
