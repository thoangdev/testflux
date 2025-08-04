# Deployment Guide

Comprehensive deployment guide for TestFlux across different environments and platforms.

## 🎯 Deployment Overview

TestFlux supports multiple deployment strategies:
- **Local Development**: Docker Compose
- **Staging/Testing**: Docker Compose or Kubernetes
- **Production**: Kubernetes, AWS ECS, or Render
- **Enterprise**: On-premises or private cloud

## 🚀 Quick Start Deployments

### Local Development
```bash
# Clone repository
git clone https://github.com/your-org/testflux.git
cd testflux

# Set up environment
cp .env.example .env
# Edit .env with your settings

# Start services
docker-compose up -d

# Verify deployment
curl http://localhost:3000/health
```

### Production (Docker Compose)
```bash
# Production deployment
docker-compose -f deployment/docker-compose.prod.yml up -d

# With reverse proxy
docker-compose -f deployment/docker-compose.prod.yml --profile proxy up -d
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (1.21+)
- kubectl configured
- Helm 3.x installed

### Helm Chart Deployment
```bash
# Add TestFlux Helm repository
helm repo add testflux https://charts.testflux.io
helm repo update

# Install with default values
helm install testflux testflux/testflux

# Install with custom values
helm install testflux testflux/testflux -f values.yaml
```

### Manual Kubernetes Deployment
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: testflux
---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: testflux-config
  namespace: testflux
data:
  NODE_ENV: "production"
  PORT: "3001"
  LOG_LEVEL: "info"
---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: testflux-secrets
  namespace: testflux
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:pass@postgres:5432/testflux"
  JWT_SECRET: "your-super-secret-jwt-key"
  SENTRY_DSN: "https://your-dsn@sentry.io/project"
---
# k8s/deployment-backend.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: testflux-backend
  namespace: testflux
spec:
  replicas: 3
  selector:
    matchLabels:
      app: testflux-backend
  template:
    metadata:
      labels:
        app: testflux-backend
    spec:
      containers:
      - name: backend
        image: ghcr.io/your-org/testflux/backend:latest
        ports:
        - containerPort: 3001
        envFrom:
        - configMapRef:
            name: testflux-config
        - secretRef:
            name: testflux-secrets
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
# k8s/service-backend.yaml
apiVersion: v1
kind: Service
metadata:
  name: testflux-backend-service
  namespace: testflux
spec:
  selector:
    app: testflux-backend
  ports:
  - port: 3001
    targetPort: 3001
  type: ClusterIP
```

## ☁️ Cloud Platform Deployments

### AWS ECS with Fargate
```json
{
  "family": "testflux",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "testflux-backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/testflux-backend:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:ssm:region:account:parameter/testflux/database-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/testflux",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Render.com Deployment
```yaml
# render.yaml
services:
  - type: web
    name: testflux-backend
    env: node
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: testflux-db
          property: connectionString
    
  - type: web
    name: testflux-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
    
databases:
  - name: testflux-db
    databaseName: testflux
    user: testflux
```

### Fly.io Deployment
```toml
# fly.toml
app = "testflux"
primary_region = "dfw"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "3001"

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true

[[vm]]
  memory = "1gb"
  cpu_kind = "shared"
  cpus = 1

[checks]
  [checks.health]
    grace_period = "10s"
    interval = "30s"
    method = "GET"
    path = "/health"
    port = 3001
    timeout = "5s"
    type = "http"
```

## 🔄 CI/CD Pipelines

### GitHub Actions Production Deploy
```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Build and push Docker images
      run: |
        # Build images
        docker build -t testflux-backend:${{ github.sha }} ./backend
        docker build -t testflux-frontend:${{ github.sha }} ./frontend
        
        # Tag for ECR
        docker tag testflux-backend:${{ github.sha }} ${{ secrets.ECR_REPOSITORY }}/backend:${{ github.sha }}
        docker tag testflux-frontend:${{ github.sha }} ${{ secrets.ECR_REPOSITORY }}/frontend:${{ github.sha }}
        
        # Push to ECR
        aws ecr get-login-password | docker login --username AWS --password-stdin ${{ secrets.ECR_REPOSITORY }}
        docker push ${{ secrets.ECR_REPOSITORY }}/backend:${{ github.sha }}
        docker push ${{ secrets.ECR_REPOSITORY }}/frontend:${{ github.sha }}
    
    - name: Deploy to ECS
      run: |
        aws ecs update-service \
          --cluster testflux-cluster \
          --service testflux-backend \
          --force-new-deployment
    
    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🛡️ Security Configuration

### SSL/TLS Configuration
```nginx
# nginx/ssl.conf
server {
    listen 443 ssl http2;
    server_name testflux.yourdomain.com;
    
    ssl_certificate /etc/ssl/certs/testflux.crt;
    ssl_certificate_key /etc/ssl/private/testflux.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Environment Security
```bash
# secrets/production.env (encrypted)
DATABASE_URL=postgresql://user:$(cat /run/secrets/db_password)@postgres:5432/testflux
JWT_SECRET=$(cat /run/secrets/jwt_secret)
SENTRY_DSN=$(cat /run/secrets/sentry_dsn)
```

## 📊 Monitoring in Production

### Health Checks
```javascript
// Comprehensive health check
app.get('/health', async (req, res) => {
  const checks = {
    app: { healthy: true, version: process.env.APP_VERSION },
    database: await checkDatabase(),
    redis: await checkRedis(),
    external_apis: await checkExternalServices(),
    memory: checkMemoryUsage(),
    disk: await checkDiskSpace(),
  };
  
  const overall = Object.values(checks).every(check => check.healthy);
  
  res.status(overall ? 200 : 503).json({
    status: overall ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks,
  });
});
```

### Metrics Endpoint
```javascript
// Prometheus metrics
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.end(register.metrics());
});
```

## 🔄 Rolling Updates

### Zero-Downtime Deployment
```bash
#!/bin/bash
# scripts/rolling-update.sh

set -e

NEW_VERSION=$1
CLUSTER="testflux-cluster"
SERVICE="testflux-backend"

echo "Deploying version: $NEW_VERSION"

# Update task definition
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json

# Update service
aws ecs update-service \
  --cluster $CLUSTER \
  --service $SERVICE \
  --task-definition testflux:$NEW_VERSION

# Wait for deployment to complete
aws ecs wait services-stable \
  --cluster $CLUSTER \
  --services $SERVICE

echo "Deployment completed successfully"

# Run health check
curl -f https://testflux.yourdomain.com/health || exit 1

echo "Health check passed"
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Update environment variables
- [ ] Run security scans
- [ ] Validate configuration
- [ ] Backup database
- [ ] Test in staging environment
- [ ] Notify team of deployment

### Deployment
- [ ] Deploy to production
- [ ] Verify health checks
- [ ] Run smoke tests
- [ ] Monitor error rates
- [ ] Check performance metrics

### Post-deployment
- [ ] Verify all features working
- [ ] Monitor logs for errors
- [ ] Update documentation
- [ ] Tag release in Git
- [ ] Notify stakeholders

## 🚨 Rollback Procedures

### Quick Rollback
```bash
# Rollback to previous version
kubectl rollout undo deployment/testflux-backend

# Or specify revision
kubectl rollout undo deployment/testflux-backend --to-revision=2

# Check rollback status
kubectl rollout status deployment/testflux-backend
```

### Database Rollback
```bash
# Restore from backup
pg_restore -d testflux backup-$(date -d "1 hour ago" +%Y%m%d_%H%M%S).sql

# Or run migration rollback
npm run db:migrate:down
```

## 📱 Monitoring Alerts

### Critical Alerts
- Service down (immediate)
- High error rate (> 5%)
- Database connection failure
- SSL certificate expiring

### Warning Alerts
- High memory usage (> 80%)
- Slow response times (> 2s)
- High CPU usage (> 80%)
- Disk space low (< 20%)
