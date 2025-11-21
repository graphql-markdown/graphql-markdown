# Scripts

This directory contains utility scripts for the GraphQL-Markdown project.

## Scripts Overview

### `publish-with-provenance.js`

Custom npm publishing script that enables provenance support when using bun.

**Purpose:** Since bun doesn't natively support npm provenance yet ([bun#15601](https://github.com/oven-sh/bun/issues/15601)), this script:
1. Uses `bun pm pack` to create package tarballs
2. Uses `bunx npm publish <tarball> --provenance` to publish with provenance
3. Cleans up tarballs after publishing

**Usage:**
```bash
# Automated (via changeset workflow)
bun run changeset:publish

# Manual
node ./scripts/publish-with-provenance.js
```

**Requirements:**
- NPM_TOKEN environment variable
- Packages must have `publishConfig.access: "public"` in package.json
- Must be run from repository root

### `build-packages.js`

Builds all packages in the monorepo.

**Usage:**
```bash
node ./scripts/build-packages.js
```

### `docs-api.sh`

Generates API documentation for all packages using TypeDoc.

**Usage:**
```bash
sh ./scripts/docs-api.sh
# or
bun run docs:api
```

### `prepare-husky.js`

Prepares husky git hooks during package installation.

**Usage:**
Automatically run during `bun install` via the `prepare` script.

### `dep-checks.js`

Validates package dependencies and ensures workspace consistency.

**Usage:**
```bash
node ./scripts/dep-checks.js
```

### `custom-frontmatter.mjs`

Custom TypeDoc plugin for generating frontmatter in documentation.

**Usage:**
Automatically used by TypeDoc configuration.

### `test-suggestions.ts`

Test utilities and helpers.

## Development

When creating new scripts:

1. **Make them executable** (if shell scripts):
   ```bash
   chmod +x scripts/new-script.sh
   ```

2. **Add shebang** for Node.js scripts:
   ```javascript
   #!/usr/bin/env node
   ```

3. **Document in this README**

4. **Add to knip.json** if needed to prevent false "unused" warnings

5. **Add npm script** in package.json if the script should be run frequently

## Testing Scripts Locally

```bash
# Test publish script (dry run - requires packages to be built)
NPM_TOKEN=dummy node ./scripts/publish-with-provenance.js

# Test build script
node ./scripts/build-packages.js

# Test docs generation
sh ./scripts/docs-api.sh
```

## CI/CD Usage

These scripts are used in GitHub Actions workflows:

- `publish-with-provenance.js` → `.github/workflows/release.yml`
- `docs-api.sh` → Local development and documentation builds
- `prepare-husky.js` → Automatically during dependency installation

## Notes

- Scripts should work on both Unix and Windows environments when possible
- Use `process.cwd()` for path resolution, not `__dirname`
- Handle errors gracefully with meaningful messages
- Log important steps for debugging
