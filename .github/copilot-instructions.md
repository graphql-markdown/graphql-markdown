# GitHub Copilot Instructions for graphql-markdown

## Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- bun (latest version recommended)
- Git
- Docker or Podman (optional, for Earthly builds)
- Earthly (optional, for containerized builds)

### Setup Steps

1. **Clone and Install**

   ```bash
   git clone https://github.com/graphql-markdown/graphql-markdown.git
   cd graphql-markdown
   nvm install  # Install Node version from .nvmrc
   nvm use      # Use the correct Node version
   npm install -g bun  # Install bun globally
   bun install  # Install dependencies
   ```

2. **Verify Setup**

   ```bash
   bun run ts:check  # Type check all packages
   bun run lint      # Run linting
   bun run prettier  # Run formatting check
   bun test          # Run all tests
   ```

3. **Build Packages**

   ```bash
   bun build:all     # Compile TypeScript for all packages
   ```

4. **Optional: Run Full CI Locally**
   ```bash
   earthly +all      # Requires Docker/Podman and Earthly
   ```

## Project Overview

GraphQL-Markdown is a flexible tool for generating Markdown documentation from GraphQL schemas, designed for static site generators like Docusaurus. This is a monorepo project containing multiple packages that work together to parse GraphQL schemas, generate documentation, and integrate with various static site generators.

### Monorepo Architecture

The project follows a monorepo structure using npm workspaces with the following core packages:

**Core Packages:**

- `core` - Main documentation generation engine
- `docusaurus` - Official Docusaurus plugin
- `cli` - Command line interface
- `types` - Shared TypeScript type definitions

**Support Packages:**

- `utils` - Common utilities
- `graphql` - Schema loading and parsing
- `logger` - Logging functionality
- `printer-legacy` - Legacy markdown generation
- `diff` - Schema diffing (optional)
- `helpers` - Directive helpers (optional)

Each package follows this structure:

```
package/
├── src/              # Source code (TypeScript)
├── tests/            # Test files (unit, integration)
│   ├── unit/         # Unit tests
│   ├── integration/  # Integration tests
│   ├── __mocks__/    # Test mocks
│   └── __data__/     # Test data
├── docs/             # API documentation (auto-generated)
├── package.json      # Package manifest
├── tsconfig.json     # TypeScript config
└── tsconfig.test.json # TypeScript test config
```

### Package Boundaries

- Packages should have clear, single responsibilities
- Inter-package dependencies should be minimized
- Use `@graphql-markdown/*` imports for package references
- Types package should contain only type definitions with no implementation

## TypeScript Standards

### Configuration

- Use strict mode (`strict: true`, `strictNullChecks: true`)
- Enable all compiler checks
- Target: `esnext`
- Module: `commonjs`
- Module resolution: `node`

### Coding Conventions

- Use TypeScript for all new code
- Add explicit return types for public functions
- Prefer interfaces over type aliases for object shapes
- Use `const` for immutable values
- Use modern ES6+ features (destructuring, spread, arrow functions)
- Prefer async/await over promise chains
- Write pure functions where possible
- Handle errors gracefully with meaningful error messages

### Type Safety

- Avoid `any` types; use `unknown` if type is truly unknown
- Use type guards for runtime type checking
- Leverage TypeScript's type inference when obvious
- Export types from `@graphql-markdown/types` package for shared types
- Use JSDoc comments with TSDoc format for public APIs

### Code Structure

- Keep schema parsing logic separate from Markdown generation
- Use clear separation of concerns between modules
- Classes are used historically but not required for new code
- Prefer functional programming patterns where applicable
- Keep functions small and focused on a single task

## Testing Guidelines

The project uses [Jest](https://jestjs.io/) for all testing with three distinct test types:

### Unit Tests

- Located in `packages/*/tests/unit/`
- Test individual units of code (functions, class methods)
- Must mock all external calls (use Jest mocks)
- Should be fast and isolated
- Run with: `bun test` (runs all test types)
- Naming: `*.test.ts` or `*.spec.ts`

**Example Unit Test Pattern:**

```typescript
import { functionToTest } from "../src/utils";

describe("functionToTest", () => {
  it("should handle expected input", () => {
    const result = functionToTest("input");
    expect(result).toBe("expected");
  });

  it("should throw error for invalid input", () => {
    expect(() => functionToTest(null)).toThrow();
  });
});
```

### Integration Tests

- Located in `packages/*/tests/integration/`
- Test the logic of main classes and their interactions
- Use filesystem mocking with `memfs` when needed
- Run with: `bun test` (included in all tests)
- May use snapshots for complex output validation

### Smoke Tests (E2E)

- Test the complete plugin behavior end-to-end
- Run within Docker containers using Earthly
- Validate CLI options and complete workflows with `earthly +smoke-cli-test`
- Run with: `earthly +smoke-docusaurus-test` for Docusaurus plugin
- Update when making changes to CLI or plugin options

### Test Requirements

- Write tests for all new features
- Update tests when modifying existing code
- Ensure tests are readable and maintainable
- Maintain high code coverage (aim for >80%)
- All tests must pass before committing
- Mock external dependencies appropriately

### Mutation Testing

The project uses [Stryker Mutator](https://stryker-mutator.io/) to validate test quality:

- Run with: `earthly +mutation-test`
- Ensures tests can catch code changes
- Mutation score must meet project thresholds (CI checks)
- Not required for contributors but may be run on PRs

## Build Workflows

### npm Commands

```bash
# Install dependencies
bun install

# Type checking
bun ts:check

# Linting and formatting
bun lint

# Testing
bun test          # Run all tests
bun test:ci       # Run tests in CI mode

# Build
bun build:all         # Compile all packages
bun clean:all         # Clean build artifacts

# Documentation
bun docs:api:all  # Generate API docs for all packages

# Code quality
bun prettier      # Check code formatting
bun knip          # Check for unused dependencies
```

### Earthly Workflows

The project uses [Earthly](https://earthly.dev/) for containerized builds:

```bash
earthly +all           # Run complete CI pipeline
earthly +lint          # Run linting checks
earthly +build         # Build all packages
earthly +unit-test     # Run unit tests
earthly +integration-test  # Run integration tests
earthly +smoke-test    # Run E2E smoke tests
earthly +mutation-test # Run mutation testing
earthly +build-docs    # Build documentation site
earthly +build-image   # Build Docker image for docs
```

**Earthly targets follow this order:**

1. `+deps` - Install dependencies
2. `+lint` - Type check, Prettier, ESLint
3. `+build` - Build all packages
4. `+unit-test` - Run unit tests
5. `+integration-test` - Run integration tests
6. `+smoke-cli-test` - Run E2E tests for default CLI
7. `+smoke-docusaurus-test` - Run E2E tests for Docusaurus plugin
8. `+mutation-test` - Run mutation testing
9. `+build-docs` - Build documentation site

## Repository-Specific Conventions

### Dependencies

- Minimize external dependencies unless absolutely necessary
- Prefer well-maintained packages with active development
- Consider package size and dependency count
- Use individual packages over monolithic libraries (e.g., `lodash.get` instead of `lodash`)
- Check maintenance status: last release, commits, issue responses
- Document why new dependencies are needed

### Code Style

- Code formatting enforced by Prettier (config in `config/.prettierrc.js`)
- Linting enforced by ESLint (config in `config/.eslintrc.js`)
- EditorConfig settings in `.editorconfig`
- All files must have final newline
- Use 2 spaces for indentation
- Use LF line endings

### Commit Standards

The project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with emojis for commit messages:

- Commits are made via `git commit` which triggers interactive prompts
- Available commit types to choose from and prefix with emojis:
  - `feat` ✨ - New feature
  - `fix` 🐛 - Bug fix
  - `build` 📦️ - Update dependencies
  - `conf` 🔧 - Update configuration
  - `refactor` ♻️ - Code refactoring
  - `test` 🧪 - Update tests
  - `ci` 👷 - Update CI
  - `docs` 📝 - Update documentation
  - `tag` 🔖 - Add tag/release
  - `other` 🧑‍💻 - Other changes

### Branch Naming Conventions

- Features: `feature/short-description`
- Fixes: `fix/short-description` or `fix/issue-123`
- Documentation: `doc/short-description`

## PR and Contribution Guidelines

### Before Submitting a PR

1. Run type checking: `bun ts:check`
2. Run linting: `bun lint`
3. Run tests: `bun test`
4. Run smoke tests: `earthly +smoke-test` (if applicable)
5. Update documentation if needed
6. Use the PR template (`.github/pull_request_template.md`)

### PR Checklist

- [ ] Changes follow contributing guidelines
- [ ] Self-reviewed code
- [ ] Updated documentation
- [ ] Added tests for new features
- [ ] All tests pass locally

### Development Workflow

1. Fork the repository
2. Create a feature branch from `main`
3. Make focused, atomic commits with clear messages
4. Write tests for new functionality
5. Update relevant documentation
6. Submit PR with description of changes
7. Address review feedback

### Code Review

- Keep changes small and focused
- Each PR should address one purpose
- Provide clear PR descriptions
- Respond to review comments promptly
- Be open to feedback and suggestions

## Key Guidelines

- **Backward Compatibility:** Maintain when possible; use semantic versioning
- **API Design:** Keep public API surface minimal and clear
- **Code Quality:** Prioritize readability and maintainability
- **Documentation:** Update docs when adding features
- **Type Safety:** Leverage TypeScript's type system fully
- **Testing:** Write comprehensive tests for all changes
- **Performance:** Consider performance implications of changes
- **Security:** Never commit secrets; follow security best practices
- **Monorepo:** Respect package boundaries and dependencies
