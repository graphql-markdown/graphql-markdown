# Auto-merge rules for graphql-markdown

These rules add to the organization's auto-merge criteria. When a rule below
says "never", a maintainer merges the PR by hand.

## Required before arming auto-merge

- The PR is not a draft, every review thread is resolved, and all required
  checks pass.
- If the PR changes files under `packages/*/src/`, it adds a
  `.changeset/*.md` file or has the `no-changeset` label.

## Never arm auto-merge

- **Breaking changes.** A changeset with a `major` bump, or a PR that removes
  or renames an exported API, a configuration setting or a CLI flag.
- **Release PRs.** Version bumps in `packages/*/package.json` or
  `packages/*/jsr.json`, consumed changesets, or `CHANGELOG.md` updates written
  by `changeset version` (`bun run release:version`).
- **Release and supply-chain files.**
  - `.github/workflows/publish.yml`, `.github/workflows/publish-docs.yaml`,
    `.github/workflows/bot-approve-merge.yml` and
    `.github/workflows/actions.lock`.
  - The release scripts in `packages/tooling-config/scripts/`:
    `publish-release.mts`, `jsr-publish.mts`, `jsr-sync.mts`,
    `template-ranges.mts` and `tarball-check.mts`.
  - This file, `.gitar/config/merge.md`.
- **Security-sensitive code.**
  - Output escaping: `escapeMDX` and the other helpers in
    `packages/utils/src/string.ts`.
  - Telemetry collection: `packages/telemetry/src/payload.ts` and
    `packages/telemetry/src/sanitize.ts`.
  - Any PR that references a security advisory or a CVE.
- **Visual changes without screenshots.** Changes to
  `packages/nuxt-theme/app/**`, to the formatter presets in
  `packages/formatters/src/**`, or to `website/` styles and components need
  desktop and mobile screenshots in the PR description.

## Fine to auto-merge, once the requirements above are met

- Dependabot PRs for patch and minor updates of devDependencies and GitHub
  Actions.
- Docs-only PRs (`docs/**`, Markdown files, website content) and
  changeset-only PRs.
- Test-only PRs (`tests/**`, `**/*.test.ts`, `**/*.spec.ts`).
