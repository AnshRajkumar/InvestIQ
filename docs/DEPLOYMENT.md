# Deployment Guide

## Production Deployment Checklist

### Pre-Deployment

- [ ] Set `DEBUG=False` in environment
- [ ] Generate strong `SECRET_KEY`
- [ ] Configure PostgreSQL database
- [ ] Set up SSL/HTTPS
- [ ] Configure ALLOWED_HOSTS
- [ ] Set CORS_ALLOWED_ORIGINS to production domains
- [ ] Configure AI API keys
- [ ] Test all critical endpoints
- [ ] Run `python manage.py check --deploy`

## Gunicorn Setup

### Installation

```bash
pip install gunicorn
```

### Basic Usage

```bash
gunicorn festronix_api.wsgi:application --bind 0.0.0.0:8000
```

### Production Command

```bash
gunicorn festronix_api.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 4 \
  --worker-class sync \
  --timeout 120 \
  --access-logfile - \
  --error-logfile - \
  --log-level info
```

### With Systemd

Create `/etc/systemd/system/festronix.service`:

```ini
[Unit]
Description=Festronix Django Application
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/backend/venv/bin"
ExecStart=/path/to/backend/venv/bin/gunicorn \
    --workers 4 \
    --bind unix:/run/gunicorn.sock \
    festronix_api.wsgi:application

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable festronix
sudo systemctl start festronix
```

## Nginx Configuration

### Create Nginx Config

```nginx
upstream festronix {
    server unix:/run/gunicorn.sock;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Client limits
    client_max_body_size 10M;

    # API proxy
    location /api/ {
        proxy_pass http://festronix;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    # Admin interface
    location /admin/ {
        proxy_pass http://festronix;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static/ {
        alias /path/to/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /path/to/backend/media/;
        expires 7d;
    }

    # Health check
    location /health/ {
        proxy_pass http://festronix;
        access_log off;
    }
}
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Create non-root user
RUN useradd -m -u 1000 django && chown -R django:django /app
USER django

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/api/health/')"

# Run Gunicorn
CMD ["gunicorn", "festronix_api.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

### Docker Compose

```yaml
version: "3.8"

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: festronix_db
      POSTGRES_USER: festronix
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  web:
    build: ./backend
    command: gunicorn festronix_api.wsgi:application --bind 0.0.0.0:8000 --workers 4
    environment:
      DEBUG: "False"
      SECRET_KEY: ${SECRET_KEY}
      DATABASE_ENGINE: django.db.backends.postgresql
      DATABASE_NAME: festronix_db
      DATABASE_USER: festronix
      DATABASE_PASSWORD: ${DB_PASSWORD}
      DATABASE_HOST: db
      DATABASE_PORT: "5432"
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db

  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./backend/staticfiles:/app/static:ro
      - ./backend/media:/app/media:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - web

volumes:
  postgres_data:
```

Run with:

```bash
docker-compose up -d
```

## Database Migration in Production

```bash
# On server
python manage.py migrate --noinput
```

## Monitoring

### Log Aggregation (ELK Stack)

Monitor logs from Gunicorn and Django.

### Error Tracking (Sentry)

```python
# In settings.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

if not DEBUG:
    sentry_sdk.init(
        dsn="https://your-sentry-dsn@sentry.io/project",
        integrations=[DjangoIntegration()],
        traces_sample_rate=0.1,
        send_default_pii=False
    )
```

### Performance Monitoring

```bash
pip install django-prometheus
```

## Backup Strategy

### Database Backup

```bash
# PostgreSQL backup
pg_dump -U festronix festronix_db > backup.sql

# Automated daily backup
0 2 * * * pg_dump -U festronix festronix_db | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

### Media Files Backup

```bash
# Tar media directory
tar -czf media_backup.tar.gz media/

# Automated backup
0 3 * * * tar -czf /backups/media_$(date +\%Y\%m\%d).tar.gz /path/to/media/
```

## Security Hardening

### SSL/TLS

- Use Let's Encrypt for free SSL certificates
- Redirect HTTP to HTTPS
- Use HSTS headers

### Django Security

```python
# settings.py
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_SECURITY_POLICY = {
    'default-src': ("'self'",),
    'script-src': ("'self'", 'cdn.jsdelivr.net'),
    'style-src': ("'self'", 'cdn.jsdelivr.net'),
}
```

### Rate Limiting

```bash
pip install django-ratelimit
```

```python
from django_ratelimit.decorators import ratelimit

@ratelimit(key='user', rate='100/h', method='GET')
def api_view(request):
    pass
```

### API Key Rotation

- Rotate JWT secrets quarterly
- Rotate AI API keys periodically
- Use environment variables, never hardcode

## Scaling

### Database Connection Pooling

```bash
pip install psycopg2-pool
```

### Caching

```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### Load Balancing

Use AWS ELB, Nginx, or HAProxy for load balancing multiple Gunicorn instances.

### CDN

Serve static files and media through CloudFront, Cloudflare, or similar CDN.

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Run tests
        run: |
          python -m pytest

      - name: Deploy to production
        run: |
          # Deployment commands
          echo "Deploying..."
```

## Post-Deployment

1. Verify health check: `curl https://yourdomain.com/api/health/`
2. Test authentication
3. Monitor error logs
4. Set up monitoring and alerting
5. Document deployment process
6. Plan rollback strategy

## Troubleshooting

### High Memory Usage

- Reduce Gunicorn workers
- Implement connection pooling
- Monitor with `top` or `htop`

### Slow Responses

- Enable caching
- Optimize database queries
- Use APM tools (New Relic, DataDog)

### Database Connection Issues

- Check PostgreSQL is running
- Verify connection settings
- Check firewall rules

## Emergency Procedures

### Database Corruption

```bash
# Restore from backup
psql -U festronix festronix_db < backup.sql
```

### Disk Full

```bash
# Clean old logs
find /var/log -name "*.log" -mtime +30 -delete

# Clean media cache
find media/ -type f -mtime +90 -delete
```

### Service Down

```bash
# Check status
sudo systemctl status festronix

# Restart
sudo systemctl restart festronix

# Check Nginx
sudo systemctl restart nginx
```
