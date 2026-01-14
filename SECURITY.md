# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of the One Piece Lore Map seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories**: Use the [Security tab](https://github.com/HoxtaH/One-Piece-Lore-Map/security/advisories) to privately report a vulnerability
2. **Direct Contact**: Reach out to the project maintainer directly via GitHub

### What to Include

Please include as much of the following information as possible:

- Type of issue (e.g., SQL injection, XSS, authentication bypass)
- Full paths of source file(s) related to the issue
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution Target**: Within 30 days (depending on complexity)

### Disclosure Policy

- We will work with you to understand and resolve the issue quickly
- We will keep you informed of our progress
- We will credit you in our release notes (unless you prefer to remain anonymous)
- We ask that you give us reasonable time to address the issue before public disclosure

## Security Best Practices for Contributors

When contributing to this project:

1. **Never commit secrets**: API keys, passwords, or tokens should never be in code
2. **Use environment variables**: All sensitive configuration should use `.env.local`
3. **Validate inputs**: Always sanitize user inputs on both client and server
4. **Keep dependencies updated**: Regularly run `npm audit` to check for vulnerabilities

Thank you for helping keep One Piece Lore Map secure! 🏴‍☠️
