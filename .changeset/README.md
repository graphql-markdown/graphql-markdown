# Changesets

This directory contains changeset files that describe changes to packages in this monorepo.

## How to use

When you make changes to a package, create a changeset file by running:

```bash
bun changeset
```

This will prompt you to select which packages have changed and what type of change it is (major, minor, or patch).

The changeset files are used to automatically:
- Generate changelogs per package
- Determine the next version number
- Update package.json files
- Create GitHub releases

For more information, see https://github.com/changesets/changesets
