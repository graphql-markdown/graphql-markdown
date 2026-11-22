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
    `.github/workflows/changelog.yml`,
    `.github/workflows/bot-approve-merge.yml` and
    `.github/workflows/actions.lock`.
  - Any workflow change that adds a repository secret other than
    `GITHUB_TOKEN`, or changes the steps that receive one (today `BOT_PAT`,
    `SONAR_TOKEN` and `STRYKER_DASHBOARD_API_KEY`), or widens a workflow's
    `permissions`.
  - `.github/actions/**` (composite actions used by the publish workflows).
  - Everything under `packages/tooling-config/scripts/` (release scripts and
    the `shared/` and `build-packages.mts` modules they import).
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

- Dependabot and Renovate PRs for patch and minor updates of devDependencies
  and GitHub Actions. Major updates, or updates to runtime dependencies, from
  either bot are never auto-merged.
- Docs-only PRs (`docs/**`, Markdown files, website content) and
  changeset-only PRs.
- Test-only PRs (`tests/**`, `**/*.test.ts`, `**/*.spec.ts`).
