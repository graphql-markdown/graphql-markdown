# GitHub Actions Workflows

This directory contains automated workflows for the GraphQL-Markdown project.

## Workflows Overview

### Core Workflows

#### `release.yml` - Automated Release Management
**Triggers:** Push to `main` branch, manual dispatch

Manages the complete release lifecycle:
- Creates "Version Packages" PR when changesets are detected
- Publishes packages to npm with provenance when Version PR is merged
- Creates GitHub releases with changelog notes
- Handles automatic versioning based on conventional commits

**Required Secrets:**
- `BOT_PAT` - GitHub Personal Access Token for automated commits
- `NPM_TOKEN` - npm authentication token for package publishing

#### `test.yml` - Continuous Integration Testing
**Triggers:** Push, Pull Request

Runs the complete test suite:
- Unit tests
- Integration tests
- Type checking
- Linting

#### `linter.yml` - Code Quality Checks
**Triggers:** Push, Pull Request

Validates code quality:
- ESLint
- Prettier
- TypeScript checks

### Documentation Workflows

#### `publish-docs.yaml` - Documentation Publishing
**Triggers:** Release published, manual dispatch

Builds and publishes documentation to the GitHub Pages site.

**Required Secrets:**
- `BOT_PAT` - GitHub token for pushing to docs repo
- `DOCKERHUB_USERNAME` - Docker Hub credentials
- `DOCKERHUB_TOKEN` - Docker Hub credentials

#### `changelog.yml` - Changelog Updates
**Triggers:** Release published, manual dispatch

Updates the main CHANGELOG.md file from GitHub releases.

### Automation Workflows

#### `stale.yml` - Inactive Issue Management
**Triggers:** Weekly schedule (Monday 9:00 UTC), manual dispatch

Automatically manages stale issues and PRs:
- Marks issues inactive after 60 days
- Marks PRs inactive after 90 days
- Closes after additional grace period
- Respects labels like `pinned`, `security`, `help wanted`

#### `preview-packages.yml` - Preview Package Publishing
**Triggers:** Pull requests (with `preview` label or from maintainers)

Publishes preview packages using pkg.pr.new for testing changes before merge.

### Security Workflows

#### `codeql-analysis.yml` - Security Scanning
**Triggers:** Push, Pull Request, schedule

Runs CodeQL analysis to detect security vulnerabilities.

#### `danger-js.yml` - PR Quality Checks
**Triggers:** Pull requests

Runs automated PR reviews and checks using Danger.js.

### Testing Workflows

#### `smoke.yml` - Smoke Testing
**Triggers:** Push, Pull Request

Runs end-to-end smoke tests for CLI and Docusaurus plugin.

#### `mutation.yml` - Mutation Testing
**Triggers:** Manual dispatch

Runs Stryker mutation testing to validate test quality.

### Bot Workflows

#### `bot-approve-merge.yml` - Automated PR Management
**Triggers:** Pull requests from dependabot

Automatically approves and merges dependency update PRs from Dependabot.

## Workflow Dependencies

```
release.yml
  ├── Requires: test.yml, linter.yml (via branch protection)
  ├── Triggers: publish-docs.yaml, changelog.yml
  └── Creates: GitHub Releases, npm packages

test.yml + linter.yml
  └── Blocks: Merging to main

preview-packages.yml
  └── Provides: Test packages for PRs
```

## Setting Up Secrets

Required repository secrets:

```
BOT_PAT          - GitHub PAT with repo and workflow permissions
NPM_TOKEN        - npm token with publish permissions  
DOCKERHUB_USERNAME - Docker Hub username
DOCKERHUB_TOKEN    - Docker Hub access token
```

## Local Testing

Most workflows can be tested locally:

```bash
# Run tests
bun test

# Run linting
bun lint

# Create a changeset
bun changeset

# Build all packages
bun build:all

# Run smoke tests (requires Earthly)
earthly +smoke-cli-test
earthly +smoke-docusaurus-test
```

## Troubleshooting

### Release workflow not creating PR
- Verify changesets exist in `.changeset/` directory
- Check workflow run logs in Actions tab
- Ensure BOT_PAT has correct permissions

### Publish fails
- Verify NPM_TOKEN is valid and has publish permissions
- Check package versions don't already exist on npm
- Review workflow logs for specific errors

### Preview packages not building
- Verify PR has `preview` label or is from a maintainer
- Check that packages build successfully locally
- Review workflow logs

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [npm Provenance](https://docs.npmjs.com/generating-provenance-statements)
