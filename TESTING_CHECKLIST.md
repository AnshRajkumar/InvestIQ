# InvestIQ Authentication Testing Checklist

## Pre-Testing Setup

### 1. Verify Both Servers Are Running

**Backend (Port 8000):**

```bash
cd backend
python manage.py runserver
```

Should display: `Starting development server at http://127.0.0.1:8000/`

**Frontend (Port 5173):**

```bash
cd frontend
npm run dev
```

Should display: `Local: http://localhost:5173/`

### 2. Ensure Database is Ready

```bash
cd backend
python manage.py migrate
```

### 3. Create Test User (if needed)

```bash
bash setup_test_data.sh
```

---

## Test Cases

### Test 1: Login with Demo Account ✓

**Objective**: Verify login functionality with pre-created account

**Steps:**

1. Navigate to `http://localhost:5173/login`
2. Enter email: `john@example.com`
3. Enter password: `TestPass123!`
4. Click "Login"

**Expected Results:**

- ✓ No error messages displayed
- ✓ Redirect to `/dashboard`
- ✓ Dashboard displays user info
- ✓ Tokens stored in localStorage
- ✓ Username appears in navbar

**Verification:**

```javascript
// Check browser console:
localStorage.getItem("access_token"); // Should return token
localStorage.getItem("refresh_token"); // Should return token
```

---

### Test 2: Registration with New Account ✓

**Objective**: Verify complete user registration flow

**Steps:**

1. Navigate to `http://localhost:5173/register`
2. Fill in the form:
   - First Name: `Test`
   - Last Name: `User`
   - Username: `testuser123`
   - Email: `test@example.com`
   - Password: `SecurePass#123`
   - Confirm Password: `SecurePass#123`
   - Experience Level: `Beginner`
   - Risk Tolerance: `Medium`
3. Click "Create Account"

**Expected Results:**

- ✓ Form validates all fields
- ✓ No validation errors shown
- ✓ Success message displays
- ✓ Redirect to login page after 2 seconds
- ✓ Can login with new credentials

**Verification:**

```bash
# Try logging in with new account
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass#123"}'
```

---

### Test 3: Password Validation ✓

**Objective**: Verify password requirements are enforced

**Steps on RegisterPage:**

1. Navigate to `/register`
2. Try these passwords and verify error messages:
   - `abc` - Should show: "Password must be at least 8 characters"
   - `password123` - Should show: "needs uppercase"
   - `PASSWORD123` - Should show: "needs lowercase"
   - `PassWord` - Should show: "needs number"
   - `PassWord1` - Should show: "needs special char"
   - `SecurePass#123` - Should be valid ✓

**Expected Results:**

- ✓ Real-time validation feedback
- ✓ Password strength meter shows
- ✓ Strength increases as requirements met
- ✓ Can only submit when all requirements met
- ✓ "Passwords match" message shown

---

### Test 4: Form Validation Errors ✓

**Objective**: Verify all form validations work

**Test Invalid Email:**

1. Go to `/register`
2. Enter email: `notanemail`
3. Leave other fields empty
4. Click "Create Account"
5. Should show: "Enter a valid email address"

**Test Password Mismatch:**

1. Fill all fields
2. Password: `SecurePass#123`
3. Confirm: `DifferentPass#123`
4. Should show: "Passwords do not match"

**Test Short Username:**

1. Fill all fields
2. Username: `ab`
3. Should show: "Username must be at least 3 characters"

**Expected Results:**

- ✓ Error messages are specific
- ✓ Invalid field is highlighted in red
- ✓ Form prevents submission when invalid
- ✓ Errors clear when field is corrected

---

### Test 5: Profile Access After Login ✓

**Objective**: Verify user can access profile after login

**Steps:**

1. Login with `john@example.com` / `TestPass123!`
2. You should be redirected to `/dashboard`
3. Dashboard should display:
   - User name
   - Email
   - Experience level
   - Risk tolerance
   - Statistics (if available)

**Expected Results:**

- ✓ Dashboard loads without errors
- ✓ User information is displayed
- ✓ Profile data matches login account
- ✓ No 403 or 401 errors

**API Verification:**

```bash
# Get your access token from localStorage and use it:
TOKEN="your_access_token_here"

curl -X GET http://localhost:8000/api/auth/profile/me/ \
  -H "Authorization: Bearer $TOKEN"

# Should return user data with these fields:
# {
#   "id": 1,
#   "email": "john@example.com",
#   "username": "johndoe",
#   "first_name": "John",
#   "last_name": "Doe",
#   ...
# }
```

---

### Test 6: Logout Functionality ✓

**Objective**: Verify logout clears session

**Steps:**

1. Login successfully
2. Click Logout button (in navbar)
3. Should redirect to `/login`

**Expected Results:**

- ✓ Tokens removed from localStorage
- ✓ User state is cleared
- ✓ Redirected to login page
- ✓ Cannot access dashboard without re-login

**Verification:**

```javascript
// After logout:
localStorage.getItem("access_token"); // Should be null
localStorage.getItem("refresh_token"); // Should be null
```

---

### Test 7: Session Persistence ✓

**Objective**: Verify session persists across page refresh

**Steps:**

1. Login with `john@example.com` / `TestPass123!`
2. Verify you're on `/dashboard`
3. Refresh the page (F5)
4. You should remain logged in and on dashboard

**Expected Results:**

- ✓ Page refreshes without redirect
- ✓ Still logged in after refresh
- ✓ User data still displayed
- ✓ No 401 errors

---

### Test 8: Protected Routes ✓

**Objective**: Verify unauthenticated access is blocked

**Steps:**

1. Clear localStorage (simulate logged out):
   ```javascript
   localStorage.clear();
   ```
2. Try to navigate to `/dashboard`
3. Should redirect to `/login`

**Expected Results:**

- ✓ Redirected to login page
- ✓ Cannot access protected pages without auth
- ✓ Dashboard is not displayed

---

### Test 9: Email Uniqueness ✓

**Objective**: Verify duplicate email registration is prevented

**Steps:**

1. Go to `/register`
2. Try to register with email: `john@example.com` (already used)
3. Click "Create Account"

**Expected Results:**

- ✓ Registration fails
- ✓ Error message shows
- ✓ Error states email already exists
- ✓ Form remains on register page

---

### Test 10: Username Uniqueness ✓

**Objective**: Verify duplicate username registration is prevented

**Steps:**

1. Go to `/register`
2. Try to register with username: `johndoe` (already used)
3. Different email this time
4. Click "Create Account"

**Expected Results:**

- ✓ Registration fails
- ✓ Error message shows
- ✓ Error states username already exists

---

### Test 11: API Error Handling ✓

**Objective**: Verify proper error handling in frontend

**Simulate Backend Offline:**

1. Stop the backend server
2. Try to login
3. Should see error message

**Expected Results:**

- ✓ Clear error message displayed
- ✓ Suggests checking connection
- ✓ Form is not cleared
- ✓ User can retry

---

### Test 12: Token Refresh ✓

**Objective**: Verify token auto-refresh works (optional - depends on implementation)

**How to Test (Advanced):**

1. Login successfully
2. Wait for access token to expire (or manually expire)
3. Make API call (go to profile page)
4. Should automatically refresh token
5. Request succeeds

---

## API Endpoint Testing (with curl)

### Test Login Endpoint

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "TestPass123!"
  }'

# Expected Response:
# {
#   "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
#   "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
#   "user": {...}
# }
```

### Test Register Endpoint

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

# Expected Response (201):
# {
#   "message": "User registered successfully",
#   "user": {...}
# }
```

### Test Profile Endpoint

```bash
TOKEN="your_access_token_here"

curl -X GET http://localhost:8000/api/auth/profile/me/ \
  -H "Authorization: Bearer $TOKEN"

# Expected Response:
# {
#   "id": 1,
#   "email": "john@example.com",
#   "username": "johndoe",
#   ...
# }
```

---

## Performance Testing

### Test 1: Login Response Time

- Should complete in < 1 second
- Network latency included

### Test 2: Registration Response Time

- Should complete in < 2 seconds
- Database write included

### Test 3: Profile Load Time

- Should load in < 500ms
- Database read included

---

## Security Testing

### Test 1: Password Not Visible in Network Tab

1. Login
2. Open DevTools → Network tab
3. Check login request → Request body
4. Password should NOT be visible in plaintext if using HTTPS

### Test 2: Tokens Not in URL

- Login and check URL
- Should NOT see tokens in address bar
- Should be stored securely in localStorage

### Test 3: CORS Headers

```bash
curl -i -X OPTIONS http://localhost:8000/api/auth/login/ \
  -H "Origin: http://localhost:5173"

# Should see: Access-Control-Allow-Origin: http://localhost:5173
```

---

## Troubleshooting Guide

### Issue: "CORS error" in console

**Solution:**

1. Verify backend CORS settings
2. Check allowed origins include `http://localhost:5173`
3. Restart backend server

### Issue: "404 Not Found" on login

**Solution:**

1. Verify backend is running on port 8000
2. Check URL structure: `/api/auth/login/`
3. Check URLs are properly configured in Django

### Issue: "Invalid credentials" but password is correct

**Solution:**

1. Verify user exists: Check database
2. Verify password hashing works
3. Test with admin account

### Issue: Tokens not being stored

**Solution:**

1. Check browser localStorage is enabled
2. Verify API returns tokens in response
3. Check for console errors

### Issue: Can't create account - "User already exists"

**Solution:**

1. Use different email address
2. Use different username
3. Check user wasn't previously created

---

## Success Criteria

✓ All 12 test cases pass
✓ No console errors
✓ No network errors (all green in Network tab)
✓ Proper error messages for all failures
✓ Fast response times (< 2 seconds)
✓ Session persists across refresh
✓ Protected routes properly restricted
✓ Tokens properly stored and used
✓ Password validation works correctly
✓ Form validation complete

**System is READY FOR PRODUCTION when all success criteria are met.**

---

## Sign-Off

- [ ] All test cases completed
- [ ] All test cases passed
- [ ] No outstanding issues
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation reviewed

**Tested by:** ******\_\_\_******
**Date:** ******\_\_\_******
