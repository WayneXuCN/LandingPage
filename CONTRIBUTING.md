# Contributing to Starter Theme

Thank you for considering contributing to Starter Theme! This document outlines the guidelines for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

When filing a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node/Bun version)

### Suggesting Features

Feature requests are welcome! Please provide:

- **Clear description** of the proposed feature
- **Use case** explaining why this feature would be useful
- **Possible implementation** if you have ideas

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** following our coding standards
4. **Test your changes**:

   ```bash
   bun run build
   bun run test
   ```

5. **Commit** with a clear message:

   ```bash
   git commit -m "feat: add new feature"
   ```

6. **Push** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request** with a clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/starter-theme.git
cd starter-theme

# Install dependencies
bun install

# Start development server
bun run dev

# Run tests
bun run test

# Format code
bun run format
```

## Coding Standards

### Code Style

- Use **Prettier** for formatting (run `bun run format`)
- Follow existing code patterns
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### File Organization

- Components go in `src/components/astro/`
- Translations go in `i18n/`
- Utilities go in `src/lib/`
- Tests go in `tests/`

## Testing

Before submitting a PR, ensure:

1. All existing tests pass: `bun run test`
2. Build succeeds: `bun run build`
3. Code is formatted: `bun run format`

Add new tests for new features when applicable.

## Questions?

Feel free to open an issue for any questions about contributing.

Thank you for helping make Starter Theme better! 🎉
