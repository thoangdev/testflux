# Security Policy

## Supported Versions

We support security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. Please follow these steps to report a vulnerability:

1. **Do not** create a public GitHub issue for security vulnerabilities.
2. Email security concerns to: security@testflux.com
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge receipt within 24 hours and provide a detailed response within 72 hours.

## Security Measures

### Authentication & Authorization
- JWT tokens with configurable expiration
- Role-based access control (RBAC)
- Password hashing using bcrypt
- Rate limiting on authentication endpoints

### API Security
- CORS configuration
- Request validation using Joi
- File upload size limits
- SQL injection prevention via parameterized queries

### Infrastructure Security
- Environment variable validation
- Docker security best practices
- HTTPS enforcement in production
- Security headers via Helmet.js

### Data Protection
- Sensitive data encryption at rest
- Audit logging for admin actions
- Secure session management
- Input sanitization
