# 🚀 InvestIQ Deployment Guide

## Quick Deployment (Recommended for Hackathon)

This guide will help you deploy your full-stack application for FREE using Railway (backend) and Vercel (frontend).

---

## 📋 Prerequisites

1. GitHub account
2. Railway account (sign up at https://railway.app)
3. Vercel account (sign up at https://vercel.com)
4. Your code pushed to GitHub

---

## 🔧 Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account & New Project

1. Go to https://railway.app and sign in with GitHub
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository: `InvestIQ` or `Festronix`
5. Select the `source/website/backend` directory (or configure root path)

### Step 2: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a database and set the `DATABASE_URL` environment variable

### Step 3: Configure Environment Variables

Click on your backend service, go to "Variables" tab, and add:

```bash
# Required Variables
SECRET_KEY=your-super-secret-key-change-this-to-random-string
DEBUG=False
ALLOWED_HOSTS=.railway.app,.vercel.app
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Optional (for full functionality)
OPENAI_API_KEY=your-openai-key-here
GEMINI_API_KEY=your-gemini-key-here
RAZORPAY_KEY_ID=your-razorpay-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

**Important**: After adding variables, Railway will automatically redeploy.

### Step 4: Configure Build Settings (if needed)

Railway should auto-detect your Django app. If not:

- **Root Directory**: `source/website/backend`
- **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- **Start Command**: `gunicorn investiq_api.wsgi:application --bind 0.0.0.0:$PORT`

### Step 5: Get Your Backend URL

1. Go to "Settings" tab
2. Under "Domains", click "Generate Domain"
3. Copy the URL (e.g., `https://your-app.railway.app`)
4. **Save this URL** - you'll need it for frontend deployment

### Step 6: Run Initial Migration

1. In Railway, go to your backend service
2. Click on "Deployments" tab
3. Once deployed, you can run migrations via Railway CLI or they'll run automatically via Procfile

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account & Import Project

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. **IMPORTANT**: Set root directory to `source/website/frontend`

### Step 2: Configure Build Settings

Vercel should auto-detect Vite. Verify these settings:

- **Framework Preset**: Vite
- **Root Directory**: `source/website/frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variable

In Vercel project settings → "Environment Variables", add:

```bash
VITE_API_URL=https://your-backend.railway.app/api
```

Replace `your-backend.railway.app` with your actual Railway URL from Part 1, Step 5.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. You'll get a URL like `https://your-app.vercel.app`

### Step 5: Update Backend CORS

1. Go back to Railway
2. Update `CORS_ALLOWED_ORIGINS` variable to include your Vercel URL:
   ```
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app
   ```
3. Railway will auto-redeploy

---

## ✅ Part 3: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try to register/login
3. Test community features, chat, etc.
4. Check backend health: `https://your-backend.railway.app/api/health/`

---

## 🔥 Quick Fixes for Common Issues

### Backend won't start?
- Check Railway logs for errors
- Verify `DATABASE_URL` is set automatically by PostgreSQL
- Ensure `ALLOWED_HOSTS` includes `.railway.app`

### Frontend can't connect to backend?
- Verify `VITE_API_URL` is set correctly in Vercel
- Check CORS settings in Railway include your Vercel URL
- Look at browser console for CORS errors

### Database errors?
- Migrations should run automatically via Procfile
- If not, use Railway CLI: `railway run python manage.py migrate`

### Static files not loading?
- Verify `collectstatic` ran during build
- Check WhiteNoise is configured (it is in your settings.py)

---

## 🎯 Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Database connected and migrated
- [ ] Frontend deployed and accessible
- [ ] Frontend can communicate with backend
- [ ] User registration/login works
- [ ] Community features work
- [ ] Personal chat works
- [ ] Static files load correctly

---

## 📱 Optional: Custom Domain

### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS instructions

### For Railway (Backend):
1. Go to Service Settings → Domains
2. Add custom domain
3. Update DNS records

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Django Deployment**: https://docs.djangoproject.com/en/4.2/howto/deployment/

---

## 🎉 Alternative: One-Click Deploy (Future)

You can also create deploy buttons:

**Backend Railway Button**:
```
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/django)
```

**Frontend Vercel Button**:
```
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=your-repo-url)
```

---

## 💡 Pro Tips

1. **Use Railway's free tier**: $5 credit (500 hours runtime)
2. **Use Vercel's free tier**: Unlimited deployments for hobby projects
3. **Enable automatic deployments**: Both platforms auto-deploy on git push
4. **Monitor usage**: Check Railway dashboard to avoid overages
5. **Use environment-specific settings**: Keep dev/prod configs separate

---

## 🔒 Security Reminders

- [ ] Change `SECRET_KEY` to a random string
- [ ] Set `DEBUG=False` in production
- [ ] Never commit `.env` files
- [ ] Use strong passwords for admin accounts
- [ ] Enable HTTPS (automatic on Railway & Vercel)

---

**Your deployment should be live now! 🚀**

Share your links:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.railway.app/api`
