# 🚀 Quick Deployment Checklist

## Before Deploying

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Generate SECRET_KEY**
   ```bash
   cd source/website/backend
   python generate_secret_key.py
   ```
   Save this key for Railway environment variables!

## Deploy Backend (5 minutes)

1. Go to https://railway.app → New Project
2. Deploy from GitHub → Select your repo
3. Add PostgreSQL database (click + New → PostgreSQL)
   - Railway automatically sets DATABASE_URL environment variable
4. Add REQUIRED environment variables to your backend service:
   ```
   SECRET_KEY=your-generated-secret-key-from-python-script
   DEBUG=False
   ALLOWED_HOSTS=.railway.app,.vercel.app
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   **Note**: Update CORS_ALLOWED_ORIGINS after you deploy frontend in step 2
5. Optional environment variables (for full features):
   ```
   OPENAI_API_KEY=sk-your-openai-key
   RAZORPAY_KEY_ID=your-razorpay-id
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   ```
6. Generate domain → Copy URL
7. Wait for deployment

## Deploy Frontend (3 minutes)

1. Go to https://vercel.com → New Project
2. Import from GitHub → Select your repo
3. **Set root directory**: `source/website/frontend`
4. Add environment variable:
   - `VITE_API_URL=https://your-backend.railway.app/api` (use your Railway URL)
5. Deploy → Copy URL

## Final Step

1. Go back to Railway
2. Update `CORS_ALLOWED_ORIGINS` to include your Vercel URL:
   ```
   https://your-app.vercel.app,https://your-app-*.vercel.app
   ```
3. Done! 🎉

## Test URLs

- Frontend: https://your-app.vercel.app
- Backend: https://your-backend.railway.app/api/health/
- Admin: https://your-backend.railway.app/admin/

## Troubleshooting

**Can't connect?**

- Check browser console for CORS errors
- Verify VITE_API_URL in Vercel matches Railway domain
- Check Railway logs for backend errors

**Database issues?**

- Migrations run automatically via Procfile
- Check Railway logs for migration errors

**Need demo user?**

- Use Railway CLI: `railway run python manage.py createsuperuser`
- Or mark existing user as premium via Django admin
