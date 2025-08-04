# Enterprise Tools Integration Guide

This document covers the integration and configuration of enterprise-grade monitoring, analytics, and security tools in TestFlux.

## 🔍 Error Tracking & Performance Monitoring - Sentry

### Overview
Sentry provides real-time error tracking, performance monitoring, and release health for TestFlux applications.

### Setup

#### 1. Create Sentry Project
```bash
# Install Sentry CLI
npm install -g @sentry/cli

# Login to Sentry
sentry-cli login

# Create new project
sentry-cli projects create testflux
```

#### 2. Backend Integration
```javascript
// backend/src/utils/sentry.js
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || 'development',
  sampleRate: parseFloat(process.env.SENTRY_SAMPLE_RATE) || 1.0,
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.1,
  integrations: [
    new ProfilingIntegration(),
  ],
  beforeSend(event) {
    // Filter sensitive data
    if (event.request?.headers) {
      delete event.request.headers.authorization;
    }
    return event;
  },
});
```

#### 3. Frontend Integration
```javascript
// frontend/src/utils/sentry.js
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 0.1,
});
```

### Configuration
```bash
# Environment Variables
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_SAMPLE_RATE=1.0
SENTRY_TRACES_SAMPLE_RATE=0.1
```

### Features
- **Error Capture**: Automatic error tracking with stack traces
- **Performance Monitoring**: API response times and database queries
- **Release Tracking**: Deploy notifications and release health
- **Custom Events**: Business metrics and user actions

---

## 📊 Product Analytics - PostHog

### Overview
PostHog provides product analytics, feature flags, and user behavior tracking for data-driven decisions.

### Setup

#### 1. Create PostHog Account
- Sign up at [PostHog Cloud](https://app.posthog.com)
- Create new project for TestFlux
- Copy API key and host URL

#### 2. Backend Integration
```javascript
// backend/src/utils/posthog.js
import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
});

export const trackEvent = (userId, event, properties = {}) => {
  if (process.env.POSTHOG_ENABLED === 'true') {
    posthog.capture({
      distinctId: userId,
      event,
      properties: {
        ...properties,
        $ip: null, // Anonymize IP
      },
    });
  }
};

export const identifyUser = (userId, properties = {}) => {
  if (process.env.POSTHOG_ENABLED === 'true') {
    posthog.identify({
      distinctId: userId,
      properties,
    });
  }
};
```

#### 3. Frontend Integration
```javascript
// frontend/src/utils/posthog.js
import posthog from 'posthog-js';

if (import.meta.env.VITE_POSTHOG_ENABLED === 'true') {
  posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
  });
}

export const trackEvent = (event, properties = {}) => {
  if (import.meta.env.VITE_POSTHOG_ENABLED === 'true') {
    posthog.capture(event, properties);
  }
};
```

### Configuration
```bash
# Environment Variables
POSTHOG_API_KEY=phc_your_api_key
POSTHOG_HOST=https://app.posthog.com
POSTHOG_ENABLED=true
```

### Analytics Events
```javascript
// Example usage
trackEvent('test_results_uploaded', {
  product_id: 'test-product',
  test_type: 'regression',
  file_count: 3,
  success: true,
});

trackEvent('dashboard_viewed', {
  page: 'trends',
  filters_applied: ['last_30_days', 'product_a'],
});
```

---

## 🛡️ Security Scanning - Snyk

### Overview
Snyk provides vulnerability scanning for dependencies, code, and containers.

### Setup

#### 1. Install Snyk CLI
```bash
npm install -g snyk
snyk auth
```

#### 2. Project Configuration
```bash
# Initialize Snyk monitoring
snyk monitor --org=your-org

# Create .snyk policy file
snyk policy
```

#### 3. CI/CD Integration
```yaml
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
          
      - name: Upload Snyk results to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: snyk.sarif
```

### Configuration
```bash
# Environment Variables
SNYK_TOKEN=your-snyk-token
SNYK_ORG=your-organization
```

### Security Policies
```yaml
# .snyk
version: v1.0.0
ignore:
  SNYK-JS-LODASH-567746:
    - '*':
        reason: No fix available
        expires: '2024-12-31T23:59:59.999Z'
patch: {}
```

---

## 📈 Code Quality - SonarQube

### Overview
SonarQube provides continuous code quality and security analysis.

### Setup

#### 1. SonarCloud Configuration
```properties
# sonar-project.properties
sonar.projectKey=testflux
sonar.organization=your-org
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.js,**/*.spec.js
sonar.coverage.exclusions=**/*.test.js,**/*.spec.js
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

#### 2. CI/CD Integration
```yaml
# .github/workflows/sonarcloud.yml
name: SonarCloud Analysis

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  sonarcloud:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests with coverage
        run: npm run test:coverage
        
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### Configuration
```bash
# Environment Variables
SONAR_TOKEN=your-sonar-token
SONAR_PROJECT_KEY=testflux
SONAR_ORGANIZATION=your-sonar-org
SONAR_HOST_URL=https://sonarcloud.io
```

### Quality Gates
```json
{
  "conditions": [
    {
      "metric": "new_coverage",
      "op": "LT",
      "value": "80"
    },
    {
      "metric": "new_maintainability_rating",
      "op": "GT",
      "value": "1"
    },
    {
      "metric": "new_security_rating",
      "op": "GT",
      "value": "1"
    }
  ]
}
```

---

## 🔄 Integration Workflow

### Development Process
1. **Code Changes**: Developer makes changes
2. **Pre-commit**: Husky runs linting and security checks
3. **CI/CD**: GitHub Actions runs all scans
4. **Quality Gates**: SonarQube validates code quality
5. **Security**: Snyk scans for vulnerabilities
6. **Monitoring**: Sentry tracks errors and performance
7. **Analytics**: PostHog captures user interactions

### Monitoring Dashboard
```javascript
// Example monitoring dashboard data
const enterpriseMetrics = {
  errors: await sentry.getErrorCount(),
  performance: await sentry.getPerformanceMetrics(),
  userActivity: await posthog.getActiveUsers(),
  vulnerabilities: await snyk.getVulnerabilityCount(),
  codeQuality: await sonar.getQualityGateStatus(),
};
```

## 🛠 Troubleshooting

### Common Issues

#### Sentry Not Capturing Errors
- Verify DSN configuration
- Check environment variables
- Ensure error boundaries are set up

#### PostHog Events Not Appearing
- Confirm API key is correct
- Check network connectivity
- Verify event payload format

#### Snyk False Positives
- Create `.snyk` policy file
- Use ignore rules for acceptable risks
- Update dependencies regularly

#### SonarQube Quality Gate Failures
- Review coverage requirements
- Address code smells and bugs
- Update quality gate thresholds

### Support Resources
- [Sentry Documentation](https://docs.sentry.io)
- [PostHog Documentation](https://posthog.com/docs)
- [Snyk Documentation](https://docs.snyk.io)
- [SonarQube Documentation](https://docs.sonarqube.org)
