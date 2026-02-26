# Quick Reference: User Authentication & Profiles

## 🚀 Quick Start

### Backend Running?

```bash
cd backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

### Frontend Running?

```bash
cd frontend
npm run dev
# http://localhost:5173
```

---

## 🔑 API Quick Reference

### 1. Register

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
# Returns: access_token, refresh_token, user
```

### 3. Get Profile (requires token)

```bash
curl -X GET http://localhost:8000/api/auth/profile/me/ \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### 4. Get Stats

```bash
curl -X GET http://localhost:8000/api/auth/profile/stats/ \
  -H "Authorization: Bearer ACCESS_TOKEN"
# Returns: predictions, learning, portfolio stats
```

### 5. Get Progress

```bash
curl -X GET http://localhost:8000/api/auth/profile/progress/ \
  -H "Authorization: Bearer ACCESS_TOKEN"
# Returns: course statuses, completion %, study hours
```

### 6. Update Progress

```bash
curl -X PUT http://localhost:8000/api/auth/profile/update_progress/ \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fundamentals_status": "completed",
    "technical_analysis_status": "in_progress"
  }'
```

### 7. Get Badges

```bash
curl -X GET http://localhost:8000/api/auth/profile/badges/ \
  -H "Authorization: Bearer ACCESS_TOKEN"
# Returns: list of earned badges
```

### 8. Get Prediction History

```bash
curl -X GET http://localhost:8000/api/auth/profile/prediction_history/?limit=20 \
  -H "Authorization: Bearer ACCESS_TOKEN"
# Returns: all user predictions with outcomes
```

---

## 📁 File Structure

```
backend/
├── investiq_api/
│   └── apps/
│       └── authentication/
│           ├── models.py           ← User, UserProgress, UserBadge, PredictionHistory
│           ├── serializers.py      ← All serializers
│           ├── views.py            ← All endpoints
│           ├── urls.py             ← Routes
│           └── migrations/
│               └── 0002_user_enhancements.py
```

---

## 🗄️ Database Models

### User Fields

```python
# Profile
username, email, first_name, last_name, bio, phone_number, location

# Preferences
experience_level, risk_tolerance, interests

# Stats
total_predictions_made, correct_predictions, prediction_accuracy
total_lessons_completed, learning_streak, total_badges_earned
portfolio_created, total_portfolio_value, portfolio_risk_score

# Timestamps
created_at, updated_at, last_login_at, last_activity_date
```

### Related Models

```
UserProgress (1:1)
  - 6 course statuses
  - overall_completion_percentage
  - total_study_hours

UserBadge (1:Many)
  - badge_type, badge_name, badge_description, badge_icon_url

PredictionHistory (1:Many)
  - stock_symbol, prediction_type, user_prediction
  - actual_outcome, is_correct, accuracy_score
```

---

## 🔐 Tokens

### Access Token

- Duration: 60 minutes (configurable)
- Use: Authorization header for API calls
- Format: `Authorization: Bearer ACCESS_TOKEN`

### Refresh Token

- Duration: 7 days (configurable)
- Use: Get new access token without logging in
- Endpoint: `POST /api/auth/refresh/`

---

## 🧪 Test Users

Create in Django shell:

```python
from django.contrib.auth import get_user_model
User = get_user_model()

user = User.objects.create_user(
    username='testuser',
    email='test@example.com',
    password='TestPass123!',
    first_name='Test',
    last_name='User'
)
```

---

## 📊 Key Calculations

### Prediction Accuracy

```python
prediction_accuracy = (correct_predictions / total_predictions_made) * 100
```

### Learning Streak

```python
# Increments if user logs in consecutive days
# Resets if more than 1 day gap
if today == last_activity_date:
    return  # Already counted today
elif yesterday == last_activity_date:
    streak += 1
else:
    streak = 1
```

### Course Completion %

```python
completed = 6 if all courses done else sum(completed_courses)
completion_percentage = (completed / 6) * 100
```

---

## 🛠️ Common Operations

### Update User Stats (called automatically)

```python
user.update_prediction_stats()   # Recalculate accuracy
user.update_learning_streak()    # Update streak
user.update_portfolio_stats()    # Sync portfolio
```

### Check User Progress

```python
progress = user.progress
print(f"Completion: {progress.overall_completion_percentage}%")
print(f"Study Hours: {progress.total_study_hours}")
```

### Get User Badges

```python
badges = user.badges.all()
for badge in badges:
    print(f"{badge.badge_name} - {badge.earned_at}")
```

### Get Prediction History

```python
predictions = user.prediction_history.all()[:10]  # Last 10
for pred in predictions:
    print(f"{pred.stock_symbol}: {pred.user_prediction} - Correct: {pred.is_correct}")
```

---

## 🚨 Common Errors & Fixes

### "User with this email already exists"

- Registration attempted with existing email
- **Fix**: Use different email or login instead

### "Invalid token"

- Token expired or corrupted
- **Fix**: Use refresh endpoint or login again

### "Authentication credentials were not provided"

- Missing Authorization header
- **Fix**: Add `Authorization: Bearer TOKEN` to request

### "Bad Request - password_confirm"

- Passwords don't match
- **Fix**: Ensure password and password_confirm are identical

### "This field may not be blank"

- Required field missing
- **Fix**: Check required fields: username, email, password

---

## 📈 What Gets Tracked

Every time user:

- **Logs in** → last_login_at updated, streak calculated
- **Makes prediction** → total_predictions_made incremented
- **Prediction resolves** → correct_predictions updated, accuracy recalculated
- **Completes course** → lessons_completed incremented, progress updated
- **Earns badge** → total_badges_earned incremented
- **Updates progress** → overall_completion_percentage recalculated

---

## 🎯 User Journey

```
Registration
  ↓
Login → last_login_at = now, streak = 1
  ↓
Make Prediction → total_predictions_made = 1
  ↓
Prediction Resolves → correct_predictions updated
  ↓
Complete Course → lessons_completed = 1, progress updated
  ↓
Earn Badge → total_badges_earned = 1
  ↓
Next Day Login → streak = 2 (if active previous day)
```

---

## 💡 Tips

1. **Test with curl first** - Ensure API works before frontend
2. **Save tokens locally** - Need them for all authenticated requests
3. **Check timestamps** - last_login_at helps with streak calculation
4. **Monitor accuracy** - Updates automatically when predictions resolve
5. **Track study hours** - Update when courses are completed

---

## 📞 Useful Commands

```bash
# Run backend
python manage.py runserver 0.0.0.0:8000

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access shell
python manage.py shell

# Reset DB (⚠️ careful!)
python manage.py flush

# Check migrations
python manage.py showmigrations

# Make migrations
python manage.py makemigrations
```

---

## 🔗 Related Files

- **Models**: `investiq_api/apps/authentication/models.py`
- **Serializers**: `investiq_api/apps/authentication/serializers.py`
- **Views**: `investiq_api/apps/authentication/views.py`
- **Routes**: `investiq_api/apps/authentication/urls.py`
- **Full Guide**: `AUTHENTICATION_GUIDE.md`
- **Complete Docs**: `AUTH_IMPLEMENTATION_COMPLETE.md`

---

**Last Updated: Feb 26, 2026**
**Status: Production Ready** ✅
