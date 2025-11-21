# Migration Guide: New Build Chain

This guide helps you migrate to the new automated build chain introduced in version 2.0.

## Overview of Changes

The new build chain introduces:
- Automated versioning with Changesets
- Automated changelog generation per package
- Automated npm publishing with provenance
- Enforced conventional commits
- Automated GitHub releases
- Preview package publishing for PRs
- Automated stale issue management

## For Contributors

### Before (Old Process)

```bash
# Make changes
git commit -m "some changes"
git push
# Manual release by maintainers
```

### After (New Process)

```bash
# Make changes
git add .

# Commit with conventional commit format (automated prompt)
git commit
# Interactive prompt will ask for:
# - Type (feat, fix, docs, etc.)
# - Subject
# - Body (optional)

# Create a changeset to document the change
bun changeset
# Interactive prompt will ask for:
# - Which packages changed
# - Version bump type (major, minor, patch)
# - Change description

git add .
git commit -m "docs: add changeset for feature X"
git push
```

### Commit Message Format

The new process enforces conventional commits:

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add GraphQL directive support` |
| `fix` | Bug fix | `fix: resolve schema parsing issue` |
| `docs` | Documentation | `docs: update API documentation` |
| `test` | Tests | `test: add unit tests for parser` |
| `refactor` | Code refactoring | `refactor: simplify schema loader` |
| `build` | Dependencies | `build: update graphql to 16.12.0` |
| `ci` | CI/CD changes | `ci: add new workflow` |
| `conf` | Configuration | `conf: update TypeScript config` |

The commit hook will validate your message format and reject invalid formats.

### Creating Changesets

When you make changes that should be released:

```bash
# After making your changes
bun changeset

# You'll be prompted:
# 1. Which packages changed? (select with arrow keys + space)
# 2. What type of change? (major/minor/patch)
# 3. Summary of change? (will appear in changelog)

# This creates a file in .changeset/ directory
git add .changeset/*
git commit -m "docs: add changeset"
git push
```

**When to create changesets:**
- ✅ Bug fixes
- ✅ New features
- ✅ Breaking changes
- ✅ Dependency updates that affect behavior
- ❌ Documentation only changes (unless user-facing)
- ❌ Test only changes
- ❌ CI/CD changes

## For Maintainers

### Releasing Packages

The release process is now fully automated:

1. **Changesets merged to `main`** → Triggers release workflow
2. **Workflow creates/updates "Version Packages" PR**
   - Updates package.json versions
   - Updates CHANGELOG.md files
   - Removes processed changesets
3. **Review and merge "Version Packages" PR**
4. **Workflow automatically:**
   - Publishes packages to npm with provenance
   - Creates GitHub releases
   - Adds release notes from changelogs

### Manual Release (if needed)

```bash
# 1. Version packages based on changesets
bun changeset:version

# 2. Review changes
git diff

# 3. Commit
git add .
git commit -m "chore: version packages"
git push

# 4. Publish (requires NPM_TOKEN)
bun changeset:publish

# 5. Create GitHub releases manually if needed
```

### Preview Packages

For testing changes in PRs:

1. Add `preview` label to the PR, or
2. PRs from maintainers automatically get preview packages

Preview packages are published to pkg.pr.new and URLs are posted as PR comments.

## Required Repository Setup

### Secrets to Add

In repository settings → Secrets and variables → Actions:

```
BOT_PAT: GitHub Personal Access Token
  - Scopes: repo, workflow
  - Used for: Creating release PRs, pushing to docs repo

NPM_TOKEN: npm Automation Token
  - Type: Automation (for provenance support)
  - Scopes: Read and write
  - Used for: Publishing packages with provenance
```

### Creating NPM_TOKEN

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click "Generate New Token" → "Automation"
3. Copy the token
4. Add as `NPM_TOKEN` secret in GitHub

### Creating BOT_PAT

1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `workflow`
4. Copy the token
5. Add as `BOT_PAT` secret in GitHub

## Branch Protection Rules

Update branch protection rules for `main`:

```
Required status checks:
  ✓ Test / test
  ✓ Lint / lint
  ✓ Type Check / ts-check

Required reviews:
  ✓ 1 approving review

Other settings:
  ✓ Require branches to be up to date
  ✓ Require conversation resolution
  ✓ Include administrators (optional)
```

## Troubleshooting

### Commit is rejected

**Error:** `commit message does not follow conventional format`

**Solution:** Ensure your commit message follows the format:
```
type: subject

optional body
```

Valid types: `feat`, `fix`, `docs`, `test`, `refactor`, `build`, `ci`, `conf`, `tag`, `other`

### Changeset creation fails

**Error:** `No packages selected`

**Solution:** Use arrow keys and spacebar to select packages in the interactive prompt.

### Release workflow fails

**Possible causes:**
1. `NPM_TOKEN` not set or expired
2. Package version already exists on npm
3. Network issues with npm registry

**Check:**
```bash
# View workflow logs in GitHub Actions
# Look for specific error messages
```

### Preview packages not created

**Requirements:**
- PR must have `preview` label OR
- PR author must be a maintainer/owner

**Check:**
```bash
# View workflow logs for preview-packages workflow
# Ensure packages build successfully locally
```

## Benefits of New Build Chain

1. **Automated versioning**: No more manual version bumps
2. **Better changelogs**: Clear, consistent changelogs per package
3. **Provenance**: Cryptographic proof of package authenticity
4. **Faster releases**: One-click merge to release
5. **Preview packages**: Test changes before merging
6. **Quality control**: Enforced commit format, automated checks
7. **Issue management**: Automatic cleanup of stale issues

## Rollback Plan

If issues arise with the new build chain:

1. **Disable automated release:**
   ```bash
   # In .github/workflows/release.yml
   # Change: on: push: branches: [main]
   # To: on: workflow_dispatch
   ```

2. **Manual publishing:**
   ```bash
   # Traditional npm publish
   cd packages/package-name
   npm publish
   ```

3. **Disable commit hooks:**
   ```bash
   # In .husky/commit-msg
   # Comment out the commitlint command
   ```

## Questions and Support

- **Documentation**: See `docs/RELEASE.md`
- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Workflows**: See `.github/workflows/README.md`

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [npm Provenance](https://docs.npmjs.com/generating-provenance-statements)
- [Commitlint](https://commitlint.js.org/)
- [pkg.pr.new](https://github.com/stackblitz-labs/pkg.pr.new)
