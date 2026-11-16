# Changesets

Each user-facing change to a package in `packages/*` needs a changeset: a small
markdown file describing the change and the version bump it deserves.

1. Run `bun changeset`.
2. Select the packages you changed.
3. Pick the bump type for each: `patch` (fixes), `minor` (new features) or
   `major` (breaking changes). Dependents are patch-bumped automatically.
4. Write the summary for users of the package, not for maintainers: say what
   changed and why it matters, not which files you touched.
5. Commit the generated `.changeset/*.md` file with your change.

Docs, CI and test-only changes do not need a changeset.

Maintainers prepare a release with `bun run release:version`, which consumes the
changesets, bumps the versions, writes each package `CHANGELOG.md` and syncs the
derived files (`jsr.json`, scaffolder template ranges, lockfile).
