# Contributing to TestFlux

Thank you for your interest in contributing to TestFlux! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Be respectful, inclusive, and constructive in all interactions.

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL (if running locally)
- Git

### Getting Started
```bash
# Clone the repository
git clone https://github.com/your-org/testflux.git
cd testflux

# Install dependencies
npm run install:all

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development environment
docker-compose up -d
```

## Development Workflow

### Branch Naming
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `chore/description` - Maintenance tasks

### Commit Messages
Follow conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Request Process
1. Create a feature branch from `develop`
2. Make your changes with tests
3. Ensure all tests pass
4. Update documentation if needed
5. Submit PR with clear description
6. Address review feedback
7. Squash commits before merge

## Code Standards

### Backend (Node.js)
- ES6+ modules
- ESLint + Prettier configuration
- JSDoc comments for functions
- Unit tests with Jest
- Integration tests for API endpoints

### Frontend (React)
- Functional components with hooks
- TypeScript encouraged for new features
- Tailwind CSS for styling
- Component tests with React Testing Library
- Storybook for component documentation

### Database
- Descriptive migration names
- Rollback scripts for all migrations
- Proper indexing for performance
- Foreign key constraints

## Testing

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### Test Coverage
- Maintain >80% code coverage
- Write tests for new features
- Include edge cases and error scenarios

## Documentation

### API Documentation
- Update OpenAPI spec for API changes
- Include request/response examples
- Document error codes and messages

### Code Documentation
- JSDoc for complex functions
- README updates for new features
- Architecture decision records (ADRs)

## Release Process

1. Create release branch from `develop`
2. Update version numbers
3. Update CHANGELOG.md
4. Create PR to `main`
5. Tag release after merge
6. Deploy to production

## Getting Help

- Check existing issues and documentation
- Join our Discord/Slack for discussions
- Create GitHub issues for bugs/features
- Email maintainers for security concerns

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Annual contributor highlights
