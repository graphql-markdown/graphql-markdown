# GitHub Copilot Instructions for graphql-markdown

## Project Overview
This is a tool for generating Markdown documentation from GraphQL schemas.

## Code Style
- Use TypeScript for type safety
- Follow existing code formatting and naming conventions
- Use modern JavaScript/TypeScript features (ES6+)
- Prefer async/await over promise chains

## Architecture Guidelines
- Keep schema parsing logic separate from Markdown generation
- Use clear separation of concerns between modules
- Write pure functions where possible
- Handle errors gracefully with meaningful messages

## Documentation
- Add JSDoc comments for public APIs
- Include examples in documentation when helpful
- Update README.md when adding new features

## Testing
- Write unit tests for new features
- Ensure tests are readable and maintainable
- Mock external dependencies appropriately

## Dependencies
- Minimize external dependencies
- Prefer well-maintained packages
- Document why dependencies are needed

## Code Standards
### Required Before Each Commit
- Run tests: `npm test` or `yarn test`
- Run linter: `npm run lint` or `yarn lint`
- Ensure all tests pass
- Fix any linting errors
- Update documentation if needed

### Development Flow
- Create feature branch from `main`
- Make focused, atomic commits with clear messages
- Write tests for new functionality
- Update relevant documentation
- Submit PR with description of changes

## Repository Structure
- `packages/*/src` - Packages source code (TypeScript)
- `packages/*/tests` - Packages unit and integration tests
- `/.github` - GitHub workflows and configurations

## Key Guidelines
- Maintain backward compatibility when possible
- Use semantic versioning for releases
- Keep the public API surface minimal and clear
- Prioritize code readability and maintainability
- Write self-documenting code with clear variable/function names

