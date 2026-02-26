# Contributing to InvestIQ

Thank you for interest in contributing! This document provides guidelines for contributing to the InvestIQ project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/InvestIQ.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Follow the setup instructions in [GETTING_STARTED.md](./docs/GETTING_STARTED.md)

## Development Workflow

### Before Starting

- Check existing issues and pull requests to avoid duplicates
- Create an issue first to discuss major changes
- For small fixes, you can proceed directly

### Code Style

**Backend (Python):**

- Follow PEP 8 style guide
- Use type hints where possible
- Maximum line length: 100 characters
- Run `flake8` before committing

**Frontend (JavaScript/React):**

- Use ESLint configuration provided
- Follow Airbnb style guide
- Use meaningful component names
- Keep components focused and reusable

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:

```
feat(auth): add two-factor authentication

Implement TOTP-based 2FA for user accounts
- Add authenticator code verification
- Store backup codes

Closes #123
```

### Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass: `make test`
4. Update CHANGELOG.md
5. Create PR with clear description
6. Address review feedback

## Reporting Issues

### Bug Reports

- Use clear, descriptive titles
- Include steps to reproduce
- Provide expected vs actual behavior
- Include environment details (OS, browser, versions)
- Attach screenshots/logs if applicable

### Feature Requests

- Clearly describe the feature
- Explain the use case and benefit
- Include mockups/examples if helpful
- Consider backward compatibility

## Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Integration Tests

```bash
docker-compose -f docker-compose.test.yml up
```

## Documentation

- Update README when behavior changes
- Add docstrings to new functions
- Update API documentation for endpoint changes
- Include examples for complex features
- Keep docs up to date

## Need Help?

- Check existing documentation in `/docs`
- Review similar existing code
- Ask in discussions or open an issue
- Contact maintainers

## Code of Conduct

We have adopted a Code of Conduct that all contributors are expected to uphold. Please read [CODE_OF_CONDUCT.md](.github/CODE_OF_CONDUCT.md) before contributing.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Happy contributing! 🎉
