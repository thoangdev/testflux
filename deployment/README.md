# Deployment Guide

## Quick Start

### Development
```bash
# Clone repository
git clone <repository-url>
cd testflux

# Start with Docker Compose
docker-compose up -d

# Or run locally
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

### Production Deployment

#### Option 1: Docker Compose
```bash
# Set environment variables
cp .env.example .env
# Edit .env with production values

# Deploy
docker-compose -f deployment/docker-compose.prod.yml up -d
```

#### Option 2: Render.com
1. Fork this repository
2. Connect to Render
3. Create PostgreSQL database
4. Deploy backend as Web Service
5. Deploy frontend as Static Site

#### Option 3: Fly.io
```bash
# Install flyctl
# Deploy backend
cd backend
fly launch
fly deploy

# Deploy frontend
cd ../frontend
fly launch
fly deploy
```

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secure random string for JWT tokens

### Optional
- `CORS_ORIGIN`: Frontend URL for CORS
- `SMTP_*`: Email notification settings
- `SLACK_WEBHOOK_URL`: Slack notifications

## Database Setup

1. Create PostgreSQL database
2. Run initialization script:
   ```sql
   \i database/init.sql
   ```
3. Change default admin password

## CI/CD Setup

1. Set GitHub secrets:
   - `TESTFLUX_API_URL`
   - `TESTFLUX_API_TOKEN`
2. Use workflow template in `.github/workflows/upload-results.yml`

## Monitoring

- Health check: `GET /health`
- Database: Use pgAdmin or similar
- Logs: Docker logs or platform-specific logging

## Backup

```bash
# Database backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```
