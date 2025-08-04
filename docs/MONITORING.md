# Monitoring & Observability Guide

This document outlines the comprehensive monitoring and observability strategy for TestFlux, including metrics, logging, alerting, and performance monitoring.

## 📊 Monitoring Stack Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │    │   Infrastructure │    │   Business      │
│   Monitoring    │    │   Monitoring     │    │   Metrics       │
│                 │    │                 │    │                 │
│ • Sentry        │    │ • Docker Stats  │    │ • PostHog       │
│ • Health Checks │    │ • System Metrics│    │ • Custom Events │
│ • API Metrics   │    │ • Database      │    │ • User Analytics│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚨 Error Tracking - Sentry

### Error Categories
- **Application Errors**: Unhandled exceptions and runtime errors
- **API Errors**: HTTP 4xx/5xx responses and timeout errors
- **Database Errors**: Connection failures and query timeouts
- **Authentication Errors**: JWT validation and authorization failures

### Performance Monitoring
```javascript
// Example performance tracking
import * as Sentry from '@sentry/node';

// Database query performance
const transaction = Sentry.startTransaction({
  op: 'db',
  name: 'Get Test Results',
});

try {
  const results = await db.query('SELECT * FROM test_runs WHERE ...');
  transaction.setTag('query_type', 'select');
  transaction.setData('row_count', results.length);
} catch (error) {
  transaction.setTag('error', true);
  throw error;
} finally {
  transaction.finish();
}
```

### Custom Context
```javascript
// Add user context
Sentry.setUser({
  id: user.id,
  email: user.email,
  role: user.role,
});

// Add product context
Sentry.setTag('product_id', productId);
Sentry.setTag('environment', environment);
```

## 📈 Application Metrics

### Health Check Endpoints
```javascript
// /health - Basic health check
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    storage: await checkStorage(),
    external_apis: await checkExternalAPIs(),
  };
  
  const healthy = Object.values(checks).every(check => check.healthy);
  
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks,
  });
});

// /metrics - Prometheus metrics
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.end(prometheusRegistry.metrics());
});
```

### Custom Metrics
```javascript
import prometheus from 'prom-client';

// Counter for API requests
const apiRequestsTotal = new prometheus.Counter({
  name: 'api_requests_total',
  help: 'Total number of API requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Histogram for response times
const httpDurationMs = new prometheus.Histogram({
  name: 'http_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route'],
  buckets: [0.1, 5, 15, 50, 100, 500],
});

// Gauge for active connections
const activeConnections = new prometheus.Gauge({
  name: 'active_database_connections',
  help: 'Number of active database connections',
});
```

## 📊 User Analytics - PostHog

### Key Events to Track
```javascript
// User authentication events
posthog.capture('user_login', {
  user_id: userId,
  login_method: 'email',
  timestamp: new Date(),
});

// Test result uploads
posthog.capture('test_results_uploaded', {
  product_id: productId,
  environment: environment,
  test_type: testType,
  file_count: files.length,
  file_size_bytes: totalSize,
  processing_time_ms: processingTime,
});

// Dashboard interactions
posthog.capture('dashboard_viewed', {
  page: 'trends',
  filters: JSON.stringify(activeFilters),
  time_range: timeRange,
});

// Feature usage
posthog.capture('feature_used', {
  feature_name: 'bulk_upload',
  user_role: userRole,
  success: true,
});
```

### Feature Flags
```javascript
// Feature flag implementation
const isNewDashboardEnabled = posthog.isFeatureEnabled(
  'new_dashboard_ui',
  userId
);

if (isNewDashboardEnabled) {
  // Show new dashboard
} else {
  // Show legacy dashboard
}
```

## 🔍 Logging Strategy

### Log Levels and Usage
- **ERROR**: Application errors, failed operations
- **WARN**: Deprecated features, performance issues
- **INFO**: Important business events, user actions
- **DEBUG**: Detailed execution flow (development only)

### Structured Logging
```javascript
import { log } from '../utils/logger.js';

// Authentication events
log.auth('User login attempt', {
  userId: user.id,
  email: user.email,
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  success: true,
});

// API operations
log.api('Test results uploaded', {
  userId: user.id,
  productId: product.id,
  fileCount: files.length,
  processingTime: Date.now() - startTime,
});

// Performance logging
log.performance('Database query', queryTime, {
  query: 'SELECT test_runs',
  rowCount: results.length,
});

// Security events
log.security('Suspicious activity detected', {
  userId: user.id,
  event: 'multiple_failed_logins',
  count: failedAttempts,
  timeWindow: '5m',
});
```

## 🚨 Alerting Rules

### Critical Alerts (Immediate Response)
```yaml
# Database connection failures
- alert: DatabaseDown
  expr: up{job="postgres"} == 0
  for: 1m
  severity: critical
  
# High error rate
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
  for: 2m
  severity: critical

# API response time
- alert: HighLatency
  expr: histogram_quantile(0.95, http_duration_ms) > 1000
  for: 5m
  severity: critical
```

### Warning Alerts (Investigation Required)
```yaml
# Memory usage
- alert: HighMemoryUsage
  expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.85
  for: 10m
  severity: warning

# Disk space
- alert: DiskSpaceWarning
  expr: (node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes > 0.8
  for: 5m
  severity: warning
```

## 📊 Dashboard Configuration

### Application Dashboard
```json
{
  "dashboard": {
    "title": "TestFlux Application Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(api_requests_total[5m])",
            "legend": "Requests/sec"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(api_requests_total{status=~\"5..\"}[5m]) / rate(api_requests_total[5m]) * 100",
            "legend": "Error %"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_duration_ms)",
            "legend": "95th percentile"
          }
        ]
      }
    ]
  }
}
```

### Business Metrics Dashboard
```javascript
// PostHog dashboard queries
const businessMetrics = {
  daily_active_users: {
    event: '$pageview',
    time_range: '24h',
    breakdown: 'distinct_id',
  },
  test_uploads_per_day: {
    event: 'test_results_uploaded',
    time_range: '30d',
    aggregation: 'count',
  },
  feature_adoption: {
    event: 'feature_used',
    time_range: '7d',
    breakdown: 'feature_name',
  },
};
```

## 🔧 Monitoring Setup

### Docker Compose Monitoring Stack
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      
  grafana:
    image: grafana/grafana
    ports:
      - "3010:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana
      
  node-exporter:
    image: prom/node-exporter
    ports:
      - "9100:9100"
```

### Prometheus Configuration
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'testflux-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
    
  - job_name: 'testflux-frontend'
    static_configs:
      - targets: ['frontend:3000']
      
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
```

## 📱 Mobile/Slack Notifications

### Notification Channels
```javascript
// Slack notification for critical errors
const sendSlackAlert = async (alert) => {
  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: `🚨 *Critical Alert*: ${alert.title}`,
    attachments: [
      {
        color: 'danger',
        fields: [
          {
            title: 'Service',
            value: alert.service,
            short: true,
          },
          {
            title: 'Severity',
            value: alert.severity,
            short: true,
          },
          {
            title: 'Description',
            value: alert.description,
            short: false,
          },
        ],
      },
    ],
  });
};

// Email notification for warnings
const sendEmailAlert = async (alert) => {
  await transporter.sendMail({
    to: process.env.ALERT_EMAIL,
    subject: `TestFlux Alert: ${alert.title}`,
    html: `
      <h2>Alert Details</h2>
      <p><strong>Service:</strong> ${alert.service}</p>
      <p><strong>Severity:</strong> ${alert.severity}</p>
      <p><strong>Description:</strong> ${alert.description}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    `,
  });
};
```

## 🎯 SLA and Performance Targets

### Service Level Objectives (SLOs)
- **Availability**: 99.9% uptime
- **Response Time**: 95% of requests < 500ms
- **Error Rate**: < 0.1% of requests result in 5xx errors
- **Database**: < 100ms query response time (95th percentile)

### Key Performance Indicators (KPIs)
- **User Satisfaction**: Page load times, error rates
- **Business Metrics**: Test uploads per day, active users
- **Operational**: MTTR (Mean Time To Recovery), deployment frequency
- **Security**: Vulnerability detection time, patch deployment time

## 🔍 Troubleshooting Runbook

### High Error Rate Investigation
1. Check Sentry for recent errors
2. Review application logs
3. Verify database connectivity
4. Check external service status
5. Scale resources if needed

### Performance Degradation
1. Review Grafana dashboards
2. Check database slow query log
3. Analyze memory and CPU usage
4. Review recent deployments
5. Check for database locks

### User-Reported Issues
1. Reproduce issue in staging
2. Check user-specific logs
3. Review PostHog user journey
4. Verify data consistency
5. Check feature flag status
