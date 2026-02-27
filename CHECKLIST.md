# ✅ DEPLOYMENT CHECKLIST

## Check off each step as you complete it!

---

## BEFORE YOU START

- [ ] You have a GitHub account
- [ ] Your code is pushed to GitHub (already done ✅)
- [ ] You have 20 minutes free time

---

## BACKEND DEPLOYMENT (Railway)

### Account Setup

- [ ] Go to https://railway.app
- [ ] Login with GitHub
- [ ] Authorize Railway

### Create Project

- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Select your repository name
- [ ] Wait for initial deployment (30 seconds)

### Add Database

- [ ] Click "+ New" button
- [ ] Select "Database" → "PostgreSQL"
- [ ] Database created successfully

### Add Variables (Copy exactly!)

- [ ] Variable: `SECRET_KEY` = `*_y)qm&+&2y-x6#h$1%miefiwndm3dy%b99ak%#dw4#as(&u40`
- [ ] Variable: `DEBUG` = `False`
- [ ] Variable: `ALLOWED_HOSTS` = `.railway.app,.vercel.app`
- [ ] Variable: `CORS_ALLOWED_ORIGINS` = `http://localhost:5173`
- [ ] Wait for redeployment (2 minutes)

### Get Backend URL

- [ ] Go to Settings tab
- [ ] Click "Generate Domain"
- [ ] Copy the URL
- [ ] **PASTE YOUR URL HERE:** ****************\_\_\_****************

---

## FRONTEND DEPLOYMENT (Vercel)

### Account Setup

- [ ] Go to https://vercel.com
- [ ] Login with GitHub
- [ ] Authorize Vercel

### Import Project

- [ ] Click "Add New..." → "Project"
- [ ] Find your repository
- [ ] Click "Import"

### Configure Build

- [ ] Click "Edit" next to Root Directory
- [ ] Type: `source/website/frontend`
- [ ] Confirm

### Add Environment Variable

- [ ] Variable name: `VITE_API_URL`
- [ ] Variable value: `<YOUR-RAILWAY-URL>/api`
- [ ] Click "Add"

### Deploy

- [ ] Click "Deploy" button
- [ ] Wait 3 minutes
- [ ] Click "Visit" when done
- [ ] Copy your Vercel URL
- [ ] **PASTE YOUR URL HERE:** ****************\_\_\_****************

---

## FINAL CONNECTION

### Update CORS

- [ ] Go back to Railway
- [ ] Click your backend service
- [ ] Click "Variables" tab
- [ ] Edit `CORS_ALLOWED_ORIGINS`
- [ ] Replace with your Vercel URL (without /api)
- [ ] Click "Update"
- [ ] Wait 1 minute for redeploy

---

## TESTING

- [ ] Open your Vercel URL in browser
- [ ] Try to register a new account
- [ ] Login successfully
- [ ] Navigate to Community page
- [ ] Navigate to Personal Chat page
- [ ] Check Settings page

---

## ✅ ALL DONE!

If all boxes are checked, your app is LIVE! 🎉

**Share your app:**

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`

---

## 🆘 STUCK?

Write down which step you're stuck on and I'll help!

Step number: ******\_\_\_******

Error message (if any): ******\_\_\_******
