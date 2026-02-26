# 🚀 InvestIQ Authentication - Quick Start Guide

## Before You Start

✅ Backend running: `python manage.py runserver` (port 8000)
✅ Frontend running: `npm run dev` (port 5173)
✅ Database migrated: `python manage.py migrate`

---

## Option 1: Login with Demo Account (Fastest Way)

1. Go to **http://localhost:5173/login**
2. Enter these credentials:
   ```
   Email: john@example.com
   Password: TestPass123!
   ```
3. Click **Login**
4. You'll be redirected to the Dashboard ✅

---

## Option 2: Register New Account

1. Go to **http://localhost:5173/register**
2. Fill in the form:
   ```
   First Name:      John
   Last Name:       Doe
   Username:        johndoe123
   Email:           john123@example.com
   Password:        SecurePass#456
   Confirm:         SecurePass#456
   Experience:      Beginner
   Risk:            Medium
   ```
3. Click **Create Account**
4. You'll see success message and redirect to login
5. Login with your new credentials

**Password Requirements:**

- ✓ At least 8 characters
- ✓ At least one UPPERCASE letter
- ✓ At least one lowercase letter
- ✓ At least one NUMBER
- ✓ At least one SPECIAL character (!@#$%^&\*)

---

## What You Can Do Now

After logging in:

- ✅ View your profile
- ✅ See your statistics
- ✅ Track learning progress
- ✅ View badges/achievements
- ✅ Access other protected pages
- ✅ Make predictions
- ✅ Manage portfolio
- ✅ Read market news

---

## Troubleshooting

### "Login failed" error

→ Verify both backend and frontend are running
→ Try with demo credentials first

### "CORS error" in console

→ Restart backend server
→ Ensure frontend is on localhost:5173

### Password validation errors

→ Check all requirements are met
→ Strength meter shows in real-time

### Can't access dashboard

→ Check tokens are stored: Press F12 → Application → Storage → Local Storage

---

## API Endpoints (For Testing)

### Test Login with curl:

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"TestPass123!"}'
```

### Test Register with curl:

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "new@example.com",
    "password": "SecurePass#123",
    "password2": "SecurePass#123",
    "first_name": "New",
    "last_name": "User",
    "experience_level": "beginner",
    "risk_tolerance": "medium"
  }'
```

---

## Next Steps

1. ✅ **Try login with demo account** - Fast way to test system
2. ✅ **Create new account** - Test registration flow
3. ✅ **Explore dashboard** - See user data
4. ✅ **Read full docs** - Check AUTHENTICATION_GUIDE.md

---

## Full Documentation

For complete documentation, see:

- `AUTHENTICATION_COMPLETE.md` - Complete implementation summary
- `AUTHENTICATION_GUIDE.md` - Full API documentation
- `TESTING_CHECKLIST.md` - Comprehensive testing guide

---

**System Ready to Use! 🎉**
