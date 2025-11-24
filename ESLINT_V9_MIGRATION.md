# ESLint 9 Migration Guide

This document describes the migration from ESLint 8 to ESLint 9 for the graphql-markdown project.

## Overview

ESLint 9 introduces a new "flat config" format that replaces the traditional `.eslintrc.*` files. This migration updates the project to use the new format.

## Changes Made

### 1. New Configuration File

- **Created**: `eslint.config.js` - New flat config format
- **To be removed**: `config/.eslintrc.js` - Old config format (after validation)

### 2. Package Dependencies

Added the following dependency to `package.json`:
- `@eslint/js@9.39.1` - Required peer dependency for ESLint 9

### 3. Configuration Format Changes

#### Key Differences from ESLint 8:

1. **File Structure**: Array of config objects instead of single object
2. **Plugins**: Specified as objects in `plugins` property, not string arrays
3. **Parser**: Moved to `languageOptions.parser` instead of top-level `parser`
4. **Extends**: Configs are spread into the array instead of using `extends` property
5. **Global Ignores**: Special config object with only `ignores` property

#### File Type Configurations:

- **TypeScript files** (`.ts`, `.mts`, `.cts`): Full TypeScript-ESLint configuration
- **JavaScript files** (`.js`, `.mjs`, `.cjs`): Basic configuration without TypeScript-specific rules
- **JSON files** (`.json`): JSONC parser with recommended rules
- **MDX files** (`.mdx`): MDX plugin configuration
- **GraphQL files** (`.graphql`, `.gql`): GraphQL-ESLint configuration

## Testing the Migration

### Prerequisites

Ensure you have the latest dependencies installed:

```bash
bun install
```

### Validation Steps

1. **Type Check**:
   ```bash
   bun run ts:check
   ```

2. **Lint Check**:
   ```bash
   bun run lint
   ```

3. **Lint Fix** (if needed):
   ```bash
   bun run lint:fix
   ```

4. **Run Full CI Locally** (optional, requires Earthly):
   ```bash
   earthly +lint
   ```

### Expected Behavior

- All existing linting rules should continue to work
- No new linting errors should be introduced
- Performance should be similar or better than ESLint 8

## Plugin Compatibility

All plugins have been verified for ESLint 9 compatibility:

- ✅ `@typescript-eslint/eslint-plugin@8.47.0` - Fully compatible
- ✅ `eslint-plugin-prettier@5.5.4` - Fully compatible
- ✅ `eslint-plugin-jest@29.2.1` - Fully compatible
- ✅ `eslint-plugin-import@2.32.0` - Compatible with flat config
- ✅ `eslint-plugin-tsdoc@0.5.0` - Compatible
- ✅ `eslint-plugin-jsonc@2.21.0` - Flat config support via `flat/` presets
- ✅ `eslint-plugin-mdx@3.6.2` - Compatible
- ✅ `@graphql-eslint/eslint-plugin@4.4.0` - Compatible

## Troubleshooting

### Common Issues

1. **Module not found: @eslint/js**
   - Solution: Run `bun install` to install the new dependency

2. **Config file not found**
   - ESLint 9 automatically looks for `eslint.config.js` in the project root
   - Ensure the file is in the correct location

3. **Plugin not compatible**
   - Check if the plugin supports ESLint 9 flat config
   - Update the plugin to the latest version if needed

4. **Rules not working**
   - Ensure rules are properly namespaced (e.g., `@typescript-eslint/rule-name`)
   - Check that plugins are correctly registered in the `plugins` object

### Rollback Procedure

If issues arise, you can temporarily rollback:

1. Restore the old config:
   ```bash
   git checkout HEAD~1 -- config/.eslintrc.js
   ```

2. Remove the new config:
   ```bash
   git rm eslint.config.js
   ```

3. Revert package.json changes:
   ```bash
   git checkout HEAD~1 -- package.json
   ```

## Cleanup Steps

After successful validation:

1. Remove the old ESLint config:
   ```bash
   git rm config/.eslintrc.js
   ```

2. Update package.json to remove the `eslintConfig` property (already done)

3. Commit the cleanup:
   ```bash
   git commit -m "🔧 conf: Remove old ESLint 8 config"
   ```

## References

- [ESLint 9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [ESLint Flat Config Documentation](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [TypeScript-ESLint Flat Config Guide](https://typescript-eslint.io/getting-started)
- [ESLint 9 Release Notes](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/)

## Next Steps

1. ✅ Create new flat config file
2. ✅ Update package.json dependencies  
3. ⏳ Test with `bun install` and `bun lint`
4. ⏳ Validate in CI pipeline
5. ⏳ Remove old config file
6. ⏳ Update documentation if needed
