# User Authentication & Profiles - Complete Implementation Guide

## 🎯 Overview

InvestIQ now features a **complete user authentication system** with comprehensive learning progress, prediction history, and portfolio insights tracking.

---

## ✅ What's Been Implemented

### 1. **Enhanced User Model**

Extended User model with tracking fields:

- `total_predictions_made` - Total predictions made by the user
- `correct_predictions` - Number of correct predictions
- `prediction_accuracy` - Accuracy percentage (0-100)
- `total_lessons_completed` - Completed course lessons
- `learning_streak` - Days of continuous activity
- `last_activity_date` - Last active date for streak tracking
- `total_badges_earned` - Number of badges earned
- `portfolio_created` - Portfolio creation status
- `total_portfolio_value` - Sum of portfolio holdings
- `portfolio_risk_score` - Overall portfolio risk (0-100)
- `last_login_at` - Last login timestamp

### 2. **UserProgress Model**

Tracks learning progress across 6 core topics:

- Investment Fundamentals
- Technical Analysis
- Portfolio Management
- Risk Management
- Market Trends & Analysis
- Derivatives & Options

Each topic has:

- Status: `not_started`, `in_progress`, `completed`
- Overall completion percentage
- Total study hours

### 3. **UserBadge Model**

Achievement-based badges system:

- **First Prediction** - User's first prediction
- **5 Correct Predictions** - 5 successful predictions
- **10 Correct Predictions** - 10 successful predictions
- **Portfolio Master** - Created and managed portfolio
- **Risk Expert** - Mastered risk management
- **Consistent Learner** - Maintained learning streak
- **Market Analyst** - Analyzed market trends
- **Trading Guru** - Advanced trading knowledge

### 4. **PredictionHistory Model**

Detailed tracking of all predictions:

- Stock symbol
- Prediction type (bullish/bearish/neutral)
- User's prediction vs AI prediction
- Outcome tracking
- Accuracy score
- Confidence level
- Timestamps for analysis

---

## 📡 API Endpoints

### Authentication Endpoints

#### 1. **Register**

```
POST /api/auth/register/
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "experience_level": "beginner",  // beginner, intermediate, advanced
  "risk_tolerance": "medium"       // low, medium, high
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "experience_level": "beginner",
    "risk_tolerance": "medium",
    "total_predictions_made": 0,
    "correct_predictions": 0,
    "prediction_accuracy": 0.0,
    "total_lessons_completed": 0,
    "learning_streak": 0,
    "total_badges_earned": 0,
    "portfolio_created": false,
    "badges": [],
    "progress": null
  }
}
```

#### 2. **Login**

```
POST /api/auth/login/
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "experience_level": "beginner",
    "risk_tolerance": "medium",
    "total_predictions_made": 0,
    "correct_predictions": 0,
    "prediction_accuracy": 0.0,
    "total_lessons_completed": 0,
    "learning_streak": 0,
    "total_badges_earned": 0,
    "portfolio_created": false,
    "progress": {...},
    "badges": []
  }
}
```

#### 3. **Get User Profile**

```
GET /api/auth/profile/me/
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "bio": "",
  "profile_picture_url": null,
  "experience_level": "beginner",
  "risk_tolerance": "medium",
  "phone_number": null,
  "location": null,
  "interests": null,
  "total_predictions_made": 5,
  "correct_predictions": 3,
  "prediction_accuracy": 60.0,
  "total_lessons_completed": 2,
  "learning_streak": 3,
  "last_activity_date": "2026-02-26",
  "total_badges_earned": 1,
  "portfolio_created": true,
  "total_portfolio_value": "5000.00",
  "portfolio_risk_score": 45.5,
  "progress": {
    "id": 1,
    "fundamentals_status": "completed",
    "technical_analysis_status": "in_progress",
    "portfolio_management_status": "not_started",
    "risk_management_status": "not_started",
    "market_trends_status": "not_started",
    "derivatives_status": "not_started",
    "overall_completion_percentage": 33.33,
    "total_study_hours": 15.5,
    "created_at": "2026-02-26T10:00:00Z",
    "updated_at": "2026-02-26T10:30:00Z"
  },
  "badges": [
    {
      "id": 1,
      "badge_type": "first_prediction",
      "badge_name": "First Prediction",
      "badge_description": "Made your first prediction",
      "badge_icon_url": "/static/badges/first_prediction.png",
      "earned_at": "2026-02-26T10:05:00Z"
    }
  ],
  "recent_predictions": [...]
}
```

#### 4. **Get User Statistics**

```
GET /api/auth/profile/stats/
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "predictions": {
    "total": 5,
    "correct": 3,
    "accuracy": 60.0
  },
  "learning": {
    "lessons_completed": 2,
    "streak": 3,
    "badges": 1
  },
  "portfolio": {
    "created": true,
    "value": "5000.00",
    "risk_score": 45.5
  }
}
```

#### 5. **Get Learning Progress**

```
GET /api/auth/profile/progress/
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "id": 1,
  "fundamentals_status": "completed",
  "technical_analysis_status": "in_progress",
  "portfolio_management_status": "not_started",
  "risk_management_status": "not_started",
  "market_trends_status": "not_started",
  "derivatives_status": "not_started",
  "overall_completion_percentage": 33.33,
  "total_study_hours": 15.5,
  "created_at": "2026-02-26T10:00:00Z",
  "updated_at": "2026-02-26T10:30:00Z"
}
```

#### 6. **Get User Badges**

```
GET /api/auth/profile/badges/
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "badges": [
    {
      "id": 1,
      "badge_type": "first_prediction",
      "badge_name": "First Prediction",
      "badge_description": "Made your first prediction",
      "badge_icon_url": "/static/badges/first_prediction.png",
      "earned_at": "2026-02-26T10:05:00Z"
    }
  ],
  "count": 1
}
```

#### 7. **Get Prediction History**

```
GET /api/auth/profile/prediction_history/?limit=20
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "predictions": [
    {
      "id": 1,
      "stock_symbol": "AAPL",
      "prediction_type": "bullish",
      "user_prediction": "bullish",
      "actual_outcome": "bullish",
      "is_correct": true,
      "accuracy_score": 95.0,
      "confidence_level": 0.85,
      "predicted_at": "2026-02-26T10:00:00Z",
      "outcome_date": "2026-02-27T15:30:00Z"
    }
  ],
  "count": 5
}
```

#### 8. **Update User Profile**

```
PUT /api/auth/profile/update_profile/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Smith",
  "bio": "Finance enthusiast",
  "phone_number": "+1234567890",
  "location": "New York",
  "interests": "stocks, ETFs, crypto",
  "experience_level": "intermediate"
}
```

**Response (200):**

```json
{
  "message": "Profile updated successfully",
  "user": {...}
}
```

#### 9. **Update Learning Progress**

```
PUT /api/auth/profile/update_progress/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "fundamentals_status": "completed",
  "technical_analysis_status": "in_progress",
  "total_study_hours": 20.5
}
```

**Response (200):**

```json
{
  "message": "Progress updated",
  "progress": {...}
}
```

#### 10. **Change Password**

```
POST /api/auth/profile/change_password/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "old_password": "OldPass123!",
  "new_password": "NewPass123!"
}
```

**Response (200):**

```json
{
  "message": "Password changed successfully"
}
```

#### 11. **Logout**

```
POST /api/auth/logout/
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

---

## 🔄 User Data Flow

### Registration Flow

```
User fills registration form
    ↓
POST /api/auth/register/
    ↓
Backend validates credentials
    ↓
Creates User with default stats (0 predictions, no progress)
    ↓
Creates UserProgress record (6 courses not_started)
    ↓
Returns user data with empty badges and progress
    ↓
Frontend stores tokens in localStorage
```

### Login Flow

```
User enters email/password
    ↓
POST /api/auth/login/
    ↓
Backend validates credentials
    ↓
Updates last_login_at timestamp
    ↓
Updates learning_streak if applicable
    ↓
Returns JWT tokens + user profile
    ↓
Frontend stores tokens and initializes user context
    ↓
Frontend can now access all profile endpoints
```

### Profile Data Update

```
User changes profile/progress
    ↓
Frontend sends PUT request to /api/auth/profile/update_profile/ or update_progress/
    ↓
Backend validates and updates
    ↓
Returns updated data
    ↓
Frontend updates user state
```

---

## 📊 Database Schema

### User Model

```
User
├── id (PK)
├── username (unique)
├── email (unique)
├── password (hashed)
├── first_name
├── last_name
├── bio
├── profile_picture_url
├── experience_level (beginner/intermediate/advanced)
├── risk_tolerance (low/medium/high)
├── phone_number
├── location
├── interests
├── total_predictions_made
├── correct_predictions
├── prediction_accuracy
├── total_lessons_completed
├── learning_streak
├── last_activity_date
├── total_badges_earned
├── portfolio_created
├── total_portfolio_value
├── portfolio_risk_score
├── created_at
├── updated_at
└── last_login_at
```

### UserProgress Model

```
UserProgress
├── id (PK)
├── user_id (FK) [One-to-One]
├── fundamentals_status
├── technical_analysis_status
├── portfolio_management_status
├── risk_management_status
├── market_trends_status
├── derivatives_status
├── overall_completion_percentage
├── total_study_hours
├── created_at
└── updated_at
```

### UserBadge Model

```
UserBadge
├── id (PK)
├── user_id (FK) [One-to-Many]
├── badge_type
├── badge_name
├── badge_description
├── badge_icon_url
└── earned_at
```

### PredictionHistory Model

```
PredictionHistory
├── id (PK)
├── user_id (FK) [One-to-Many]
├── stock_symbol
├── prediction_type
├── user_prediction
├── actual_outcome
├── is_correct
├── accuracy_score
├── confidence_level
├── predicted_at
└── outcome_date
```

---

## 🧪 Test Users

Create test users with:

```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Create test user
user = User.objects.create_user(
    username='testuser',
    email='test@example.com',
    password='TestPass123!',
    first_name='Test',
    last_name='User',
    experience_level='beginner',
    risk_tolerance='medium'
)

# View user
print(f"User created: {user.email}")
print(f"Progress: {user.progress}")
print(f"Badges: {user.badges.count()}")
```

---

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Password Hashing** - Bcrypt-based password storage
3. **CORS Protection** - Cross-origin request validation
4. **Email Verification** - Email uniqueness validation
5. **Password Validation** - Minimum 8 characters
6. **Rate Limiting** - (Can be added)

---

## 📈 Next Steps

1. ✅ Full authentication system built
2. **Frontend Integration** - Build login/registration UI
3. **Profile Dashboard** - Display user stats and progress
4. **Badge Notifications** - Auto-award badges on achievements
5. **Email Integration** - Send verification and notification emails
6. **Social Login** - Google/GitHub OAuth integration
7. **Profile Settings** - User preferences and privacy settings

---

## 🚀 Production Ready

This authentication system is production-ready with:

- ✅ Secure JWT tokens
- ✅ Password validation
- ✅ CORS configured
- ✅ Comprehensive error handling
- ✅ Database migrations applied
- ✅ Full API documentation
