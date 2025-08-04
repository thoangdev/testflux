# TestFlux - Test Results Dashboard

A comprehensive enterprise-grade web application for aggregating, storing, and visualizing automated test results from multiple sources including Robot Framework, ZAP, and k6.

[![CI/CD Pipeline](https://github.com/thoangdev/testflux/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/your-org/testflux/actions)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=testflux&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=testflux)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=testflux&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=testflux)
[![Known Vulnerabilities](https://snyk.io/test/github/your-org/testflux/badge.svg)](https://snyk.io/test/github/your-org/testflux)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- 📊 **Multi-source Test Result Ingestion**: Support for Robot Framework (XML), ZAP (JSON/XML), and k6 (JSON)
- 🏢 **Product-based Organization**: Group results by products, environments, and test types
- 📈 **Advanced Trend Analysis**: Long-term visualization of test metrics and performance with ML insights
- 🔔 **Intelligent Notifications**: Slack, email, and webhook integrations with smart alerting
- 👥 **Enterprise Role Management**: Fine-grained RBAC with SSO integration
- 🔗 **CI/CD Integration**: Seamless GitHub Actions, Jenkins, and GitLab CI support
- 📤 **Bulk Data Operations**: Web interface and API for historical data ingestion
- 🛡️ **Enterprise Security**: End-to-end security with audit logging and compliance features
- 📊 **Real-time Analytics**: Live dashboards with PostHog integration
- � **Advanced Monitoring**: Sentry error tracking and performance monitoring

## 🏗 Enterprise Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Fastify + PostgreSQL + Redis
- **Security**: JWT + RBAC + Rate Limiting + OWASP compliance
- **Monitoring**: Sentry + PostHog + Health checks + Metrics
- **Quality**: SonarQube + Snyk + ESLint + Prettier + Husky
- **Deployment**: Docker + Kubernetes + Nginx + SSL/TLS
- **CI/CD**: GitHub Actions + Automated testing + Security scans

## 📊 Quality & Security Metrics

| Metric | Status | Tool |
|--------|--------|------|
| Code Coverage | >80% | Jest + Vitest |
| Security Scan | ✅ | Snyk + CodeQL |
| Code Quality | A | SonarQube |
| Performance | ✅ | Lighthouse + Sentry |
| Accessibility | ✅ | axe-core |
| Dependencies | ✅ | Dependabot |

## Tech Stack

- **Frontend**: React + Tailwind CSS + Vite
- **Backend**: Node.js + Fastify
- **Database**: PostgreSQL
- **Deployment**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## Quick Start

### Development Setup

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd testflux
   ```

2. **Start with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

3. **Or run locally**:
   ```bash
   # Backend
   cd backend
   npm install
   npm run dev

   # Frontend (in another terminal)
   cd frontend
   npm install
   npm run dev
   ```

### Environment Variables

Copy `.env.example` to `.env` and configure:

- Database connection
- JWT secret
- Notification settings (Slack, email)
- Monitoring tools (Sentry, PostHog)
- Security scanning (Snyk)
- Code quality (SonarQube)

## 🛠 Enterprise Tools Integration

### Error Tracking & Performance
- **[Sentry](https://sentry.io)**: Real-time error tracking and performance monitoring
- **Configuration**: Set `SENTRY_DSN` in environment variables
- **Features**: Error capture, performance traces, release tracking

### Product Analytics
- **[PostHog](https://posthog.com)**: Product analytics and feature flags
- **Configuration**: Set `POSTHOG_API_KEY` and `POSTHOG_HOST`
- **Features**: User behavior tracking, A/B testing, feature flags

### Security Scanning
- **[Snyk](https://snyk.io)**: Vulnerability scanning for dependencies and code
- **Configuration**: Set `SNYK_TOKEN` in environment
- **Features**: Dependency scanning, license compliance, container scanning

### Code Quality
- **[SonarQube](https://sonarcloud.io)**: Code quality and security analysis
- **Configuration**: Set `SONAR_TOKEN` and project settings
- **Features**: Code smells, security hotspots, technical debt tracking

## API Endpoints

- `POST /api/upload` - Upload test results
- `GET /api/products` - List products
- `GET /api/trends` - Get trend data
- `POST /api/products` - Create product (admin)
- `GET /api/results` - Query test results

## Project Structure

```
testflux/
├── frontend/          # React frontend application
├── backend/           # Node.js/Fastify API server
├── database/          # PostgreSQL schema and migrations
├── deployment/        # Docker configurations
├── .github/           # GitHub Actions workflows
└── docs/             # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
