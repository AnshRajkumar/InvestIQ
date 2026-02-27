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
4. Add environment variables:
   - `SECRET_KEY` (from generate_secret_key.py)
   - `DEBUG=False`
   - `ALLOWED_HOSTS=.railway.app,.vercel.app`
   - `CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app` (update after frontend deploy)
5. Generate domain → Copy URL

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
