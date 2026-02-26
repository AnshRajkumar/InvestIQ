@echo off
REM Festronix Full Stack Startup Script for Windows

echo.
echo 🚀 Starting Festronix Full Stack Application
echo ===========================================
echo.

REM Check if backend is running
for /f "tokens=5" %%a in ('netstat -ano ^| find ":8000" ^| find "LISTENING"') do (
    echo ⚠️  Backend already running on port 8000
    goto backend_skip
)

echo 📦 Starting Backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

pip install -q -r requirements.txt

echo Running migrations...
python manage.py migrate --quiet

echo Starting Django server...
start "Festronix Backend" python manage.py runserver 0.0.0.0:8000
echo ✓ Backend started

cd ..

:backend_skip

REM Check if frontend is running
for /f "tokens=5" %%a in ('netstat -ano ^| find ":5173" ^| find "LISTENING"') do (
    echo ⚠️  Frontend already running on port 5173
    goto frontend_skip
)

echo 📦 Starting Frontend...
cd frontend

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install -q
)

if not exist ".env" (
    copy .env.example .env
    echo Created .env file
)

echo Starting Vite dev server...
start "Festronix Frontend" cmd /k npm run dev

cd ..

:frontend_skip

echo.
echo ✅ Festronix is running!
echo.
echo 📍 Access the application:
echo    Frontend:  http://localhost:5173
echo    Backend:   http://localhost:8000/api
echo    Admin:     http://localhost:8000/admin
echo.
echo 🔐 Demo Credentials:
echo    Email:    admin@example.com
echo    Password: admin123
echo.
echo Windows will open two terminal windows for backend and frontend.
echo Close them to stop the application.
echo.
pause
