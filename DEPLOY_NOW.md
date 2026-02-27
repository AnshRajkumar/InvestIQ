# 🚀 SUPER SIMPLE DEPLOYMENT GUIDE

## Follow These Exact Steps (No Technical Knowledge Needed!)

---

## YOUR SECRET KEY (COPY THIS!)

```
*_y)qm&+&2y-x6#h$1%miefiwndm3dy%b99ak%#dw4#as(&u40
```

**⚠️ You'll paste this in Step 3b below!**

---

## PART 1: DEPLOY BACKEND (10 minutes)

### Step 1: Go to Railway

1. Open your browser
2. Go to: **https://railway.app**
3. Click **"Login"** (top right)
4. Click **"Login with GitHub"**
5. Authorize Railway to access your GitHub

### Step 2: Create New Project

1. Click the big **"New Project"** button
2. Click **"Deploy from GitHub repo"**
3. Find and click **"InvestIQ"** (or your repo name)
4. Railway will start deploying automatically

### Step 3: Add Database

1. Wait 30 seconds for initial deployment
2. Click the **"+ New"** button (top right)
3. Click **"Database"**
4. Click **"Add PostgreSQL"**
5. Wait 10 seconds - Database created! ✅

### Step 4: Add Environment Variables

1. Click on your **backend service** (the main one, not PostgreSQL)
2. Click the **"Variables"** tab (top menu)
3. Click **"+ New Variable"** and add these ONE BY ONE:

   **Variable 1:**
   - Name: `SECRET_KEY`
   - Value: `*_y)qm&+&2y-x6#h$1%miefiwndm3dy%b99ak%#dw4#as(&u40`

   **Variable 2:**
   - Name: `DEBUG`
   - Value: `False`

   **Variable 3:**
   - Name: `ALLOWED_HOSTS`
   - Value: `.railway.app,.vercel.app`

   **Variable 4:**
   - Name: `CORS_ALLOWED_ORIGINS`
   - Value: `http://localhost:5173`

   _(We'll update this one later!)_

4. Railway will automatically redeploy (wait 2 minutes)

### Step 5: Get Your Backend URL

1. Click the **"Settings"** tab
2. Scroll down to **"Domains"**
3. Click **"Generate Domain"**
4. **COPY THE URL** - it looks like: `https://investiq-production-abc123.up.railway.app`
5. **SAVE THIS URL** - paste it in Notes app or somewhere safe!

✅ **BACKEND IS DEPLOYED!** Let's do frontend now...

---

## PART 2: DEPLOY FRONTEND (5 minutes)

### Step 6: Go to Vercel

1. Open a new tab
2. Go to: **https://vercel.com**
3. Click **"Sign Up"** (top right)
4. Click **"Continue with GitHub"**
5. Authorize Vercel

### Step 7: Import Project

1. Click **"Add New..."** (top right)
2. Click **"Project"**
3. Find and click **"Import"** next to your repo (InvestIQ)

### Step 8: Configure Settings

1. **IMPORTANT**: Click **"Edit"** next to "Root Directory"
2. Type: `source/website/frontend`
3. Click the folder icon to confirm

### Step 9: Add Environment Variable

1. Click **"Environment Variables"** section
2. In the **NAME** field, type: `VITE_API_URL`
3. In the **VALUE** field, paste: `YOUR-RAILWAY-URL/api`

   **Example:** If your Railway URL is:
   `https://investiq-production-abc123.up.railway.app`

   Then paste:
   `https://investiq-production-abc123.up.railway.app/api`

4. Click **"Add"**

### Step 10: Deploy!

1. Click the big blue **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. When it says **"Congratulations!"** click **"Continue to Dashboard"**
4. Click **"Visit"** to see your live site
5. **COPY YOUR VERCEL URL** - looks like: `https://your-app.vercel.app`

---

## PART 3: CONNECT THEM (2 minutes)

### Step 11: Update CORS in Railway

1. Go back to Railway tab
2. Click on your backend service
3. Click **"Variables"** tab
4. Find `CORS_ALLOWED_ORIGINS`
5. Click the **pencil icon** to edit
6. Replace the value with your Vercel URL (the one you just copied)

   Example: `https://your-app.vercel.app`

7. Click **"Update"**
8. Railway will redeploy (wait 1 minute)

---

## 🎉 YOU'RE DONE!

### Test Your App:

1. Go to your Vercel URL: `https://your-app.vercel.app`
2. Click **"Sign Up"**
3. Create an account
4. Try the features!

---

## 📝 SUMMARY OF YOUR URLS

**Your Live App (Frontend):**
`https://your-app.vercel.app`

**Your API (Backend):**
`https://investiq-production-abc123.up.railway.app/api`

**Health Check (to verify backend works):**
`https://investiq-production-abc123.up.railway.app/api/health/`

**Admin Panel:**
`https://investiq-production-abc123.up.railway.app/admin/`

---

## ❓ STUCK? COMMON ISSUES:

**"Can't connect to backend"**
→ Check CORS_ALLOWED_ORIGINS in Railway matches your Vercel URL exactly

**"Database error"**
→ Make sure PostgreSQL database is created in Railway

**"Static files not loading"**
→ Wait 1-2 more minutes, Railway might still be deploying

**"VITE_API_URL not working"**
→ Make sure you added `/api` at the end of your Railway URL

---

## 🎯 SUPPORT LINKS

- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your GitHub Repo**: https://github.com/AnshRajkumar/InvestIQ

---

**That's it! Your app is now LIVE on the internet! 🚀**

Need help? Let me know which step you're stuck on!
