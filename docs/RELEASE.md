# Release Process

This document describes the automated release process for GraphQL-Markdown packages.

## Overview

The project uses [Changesets](https://github.com/changesets/changesets) for:
- Managing package versions
- Generating changelogs per package
- Publishing packages to npm with provenance
- Creating GitHub releases

## Workflow

### 1. Making Changes

When you make changes to packages:

1. Create your feature branch and make changes
2. Commit using conventional commits (enforced by commitlint)
3. Create a changeset:

```bash
bun changeset
```

This will prompt you to:
- Select which packages changed
- Select the type of change (major, minor, patch)
- Write a summary of the change

The changeset is saved as a markdown file in `.changeset/` directory.

### 2. Version Management

When changesets are merged to `main`:

1. The Release workflow automatically runs
2. It creates or updates a "Version Packages" PR
3. This PR:
   - Updates package versions based on changesets
   - Updates CHANGELOG.md files per package
   - Removes processed changeset files

### 3. Publishing

When the "Version Packages" PR is merged:

1. The Release workflow publishes packages to npm
2. Packages are published with npm provenance for security
3. GitHub releases are created for each published package
4. Release notes are extracted from package CHANGELOGs

## Commit Message Format

The project enforces conventional commits with custom types:

- `feat` ✨ - New feature (triggers minor version bump)
- `fix` 🐛 - Bug fix (triggers patch version bump)
- `build` 📦️ - Update dependencies
- `conf` 🔧 - Update configuration
- `refactor` ♻️ - Refactor code
- `test` 🧪 - Update tests
- `ci` 👷 - Update CI
- `docs` 📝 - Update documentation
- `tag` 🔖 - Add tag/release
- `other` 🧑‍💻 - Other changes

Format: `type: subject`

Example: `feat: add new GraphQL directive support`

## Package Provenance

All packages are published with [npm provenance](https://docs.npmjs.com/generating-provenance-statements), which:
- Links packages to their source code
- Provides cryptographic proof of where packages were built
- Increases trust and security

### Implementation Note

Since bun doesn't natively support npm provenance yet ([bun#15601](https://github.com/oven-sh/bun/issues/15601)), we use a workaround:
1. Use `bun pm pack` to create package tarballs
2. Use `bunx npm publish <tarball> --provenance` to publish with provenance

This is handled automatically by the `scripts/publish-with-provenance.js` script.

## Preview Packages

For pull requests, you can get preview packages:

1. Add the `preview` label to your PR, or
2. Preview packages are automatically created for PRs from maintainers

Preview packages are published to [pkg.pr.new](https://github.com/stackblitz-labs/pkg.pr.new) and can be installed directly from URLs provided in PR comments.

## Manual Release Process (if needed)

In case automation fails:

```bash
# 1. Create a changeset
bun changeset

# 2. Update versions
bun changeset:version

# 3. Commit and push
git add .
git commit -m "chore: version packages"
git push

# 4. Publish (requires NPM_TOKEN)
bun changeset:publish
```

## Security

- All releases are signed with Sigstore
- Package provenance is automatically generated
- Git commits are verified
- NPM_TOKEN is stored as a GitHub secret

## Troubleshooting

### Release PR not created

- Check that changesets exist in `.changeset/` directory
- Verify the Release workflow ran successfully
- Check workflow logs in GitHub Actions

### Publish failed

- Verify NPM_TOKEN secret is set correctly
- Check npm registry status
- Verify package versions don't already exist

### Version conflicts

- Manually resolve version conflicts in package.json files
- Re-run `bun changeset:version`
- Commit and push changes

## References

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [npm Provenance](https://docs.npmjs.com/generating-provenance-statements)
- [Sigstore](https://docs.sigstore.dev/)
