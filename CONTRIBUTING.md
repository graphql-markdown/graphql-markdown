# Contributing guide

First things first, thank you for taking the time to contribute.

Take this document as a set of guidelines, not rules, for contributing to this project. In any case, use your best judgment and feel free to propose changes to this document in a pull request.

> If this is your first time contributing to an open source project, then you should start with the section [First time contributor](#first-time-contributor), and then continue with [Getting started](#getting-started).

**Don't forget to read our [code of conduct](CODE_OF_CONDUCT.md).**

## Table of Contents

- [First time contributor](#first-time-contributor)
- [Getting started](#getting-started)
  - [Pre-requisites](#pre-requisites)
  - [Create a repository branch](#create-a-repository-branch)
- [Make your changes](#make-your-changes)
  - [Documentation](#documentation)
  - [Code](#code)
  - [Committing changes](#committing-changes)
- [Coding style](#coding-style)
  - [Code structure](#code-structure)
  - [Dependencies](#dependencies)
  - [Tests](#tests)
  - [Build documentation](#build-documentation)
  - [API Documentation](#api-documentation)
  - [Publishing Packages](#publishing-packages)
  - [Troubleshooting](#troubleshooting)

## First time contributor

We all started somewhere. And, before getting started, you might want to be familiar with some of the basic concepts used in open source projects:

- code versioning with Git
- project forking with GitHub
- pushing a pull request with GitHub

Many people did a great job at explaining those concepts. Here are a few resources:

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/): a guide to making open source contributions
- [Hello Open Source](https://github.com/mazipan/hello-open-source): a repository to learn about open source code contributions flow
- [First Contributions](https://github.com/firstcontributions/first-contributions): a repository to learn how to make your first contribution

You are now all set for your first contribution :tada:

## Getting started

### Pre-requisites

If you aim at a code contribution, you will need the following tools:

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) (macOS and Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows) (Windows)
- [typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [bun](https://bun.com/docs)

This project is fully compatible with [GitHub Codespaces](https://github.com/features/codespaces). However, if you prefer a local environment, then we recommend [VS Code](https://code.visualstudio.com/download) for this project.

### Create a repository branch

- Fork this repository ([doc](https://docs.github.com/en/get-started/quickstart/fork-a-repo))
- Create a new branch in your forked repository ([doc](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository))
  - We are using a branch naming convention:
    - feature: `feature/short-description-of-the-change`
    - fix: `fix/short-description-of-the-fix`, you can also reference an existing issue, eg `fix/issue-456`
    - documentation: `doc/short-description-of-the-change`

If you aim at a code contribution, you will need to perform a few additional steps:

- checkout your forked repository to your computer ([doc](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)).

- install the node version defined in `.nvmrc` using nvm

  ```shell
  nvm install
  nvm use
  ```

- from the local folder, install repository packages

  ```shell
  bun install
  ```

- from the local folder, check that everything is working

  ```shell
  bun run lint
  bun run build
  bun run test:unit
  bun run test:integration
  ```

## Make your changes

> **Keep changes small and focused.** This means a pull request should only aim at one purpose: fixing a typo in the documentation, fixing one bug at a time, changing one behaviour.

### Documentation

The project uses Markdown for writing documentation ([doc](https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/about-writing-and-formatting-on-github)).

You should edit the documentation or add new documentation files directly in your branch from your GitHub fork.

### Code

> We are using a monorepo, so you might want to [read about monorepo](https://monorepo.tools/) before jumping into the code.

The code base is full TypeScript using NodeJS, and Vitest for tests. The codebase can seem a bit messy, so start by reading the section [coding style](#coding-style).

When making your changes, remember to check your code by running:

- `bun run ts:check` checks that the code is TS compliant
- `bun run lint` checks that the code respects coding standards (ESLint + Prettier)
- `bun run test:[unit|integration]` runs the test suites for unit tests or integration tests
- `bun run test:all` runs every package's tests in a single Vitest instance, which is the quickest way to check the whole workspace (add `--watch` to keep it running)
- `bun run knip` checks dependencies

Smoke tests for the CLI and Docusaurus plugin run automatically in CI on every pull request (see [`.github/workflows/smoke.yml`](.github/workflows/smoke.yml)). Run them locally with `bun run smoke` (see [Tests](#tests) below).

> Note that `bun run ts:check`, `bun run lint`, `bun run prettier`, `bun run test:unit` and `bun run knip` will be automatically triggered when committing code (see [`.husky/pre-commit`](.husky/pre-commit)).

### Committing changes

This project uses the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format for commit messages, with an emoji prefix provided by [cz-emoji](https://github.com/ngryman/cz-emoji). When you run `git commit`, [commitizen](https://commitizen.github.io/cz-cli/) will be automatically triggered, and you should get some prompts on the terminal that help you write a good commit message.

The available types are configured in the root `package.json` (`config.cz-emoji`), and result in messages such as `✨ feat: add support for X` or `🐛 fix: resolve Y`. The same convention applies to pull request titles.

## Coding style

> You will certainly find awkward constructions and patterns, and you should feel free to improve the existing code.

### Code structure

The project follows a monorepo architecture with the following key packages:

Core packages:

- `core` - Main documentation generation engine
- `docusaurus` - Official Docusaurus plugin
- `cli` - Command line interface
- `types` - Shared TypeScript types

Support packages:

- `utils` - Common utilities
- `graphql` - Schema loading and parsing
- `logger` - Logging functionality
- `printer-legacy` - Legacy markdown generation
- `formatters` - Framework presets (Docusaurus, Starlight, MkDocs, Hugo, mdBook, Fumadocs, Vocs, DocFX)
- `diff` - Schema diffing (optional)
- `helpers` - Directive helpers (optional)

Tooling:

- `tooling-config` - Shared ESLint, Prettier, TypeScript, Vitest, Stryker, TypeDoc and Husky configuration, plus the build and publish scripts

Each package contains:

```text
package/
├── src/         # Source code
├── tests/       # Unit and integration test files
├── docs/        # API documentation
└── package.json # Package manifest
```

> Not every package has all of them: `types` ships types only (no `tests/` nor `docs/`), and `tooling-config` holds shared configuration instead of a `src/`.

End-to-end (smoke) tests live outside packages in a top-level directory:

```text
tests/e2e/
├── __data__/           # Shared fixtures (schemas, markdown, shared config options)
├── helpers/            # Shared test helpers (CLI runner, Docusaurus test webpack plugin)
├── cli/                # CLI-specific specs, Vitest config, and fixture data
│   ├── __data__/
│   ├── specs/
│   ├── vitest.config.mjs
│   └── vitest.setup.mjs
└── docusaurus/         # Docusaurus-specific specs, Vitest config, and fixture data
    ├── __data__/
    ├── specs/
    ├── vitest.config.mjs
    └── vitest.setup.mjs
```

### Dependencies

As a rule of thumb, try to avoid adding external packages unless you have a really good reason.

For example, it is very tempting to use `lodash`, but usually developers only need one or two functions from it. In many cases, this can be replaced by a custom function, but if you cannot, then always prefer individual packages, e.g. `lodash.get`.

When choosing an external package, always look at the following:

- Is it maintained? last release, last commit, last reply to an issue
- What is the size? The smaller the better
- How many dependencies? the lesser the merrier

### Tests

There are a lot of ways to test your code, and you should always add tests when making changes to the code.

There are 3 types of tests used in this project, all based on [Vitest](https://vitest.dev/):

- `unit` for testing individual units of code (class methods and functions). This is where most tests belong, in the `tests/unit` folder of the package you changed.

  > You should always mock external calls (see [Vitest mocking](https://vitest.dev/guide/mocking)).

- `integration` for testing how the modules of a package work together. Unit and integration tests live side by side in each package, under `tests/unit` and `tests/integration`.

  > If your tests interact with the filesystem, then you should make use of file system mocking with `memfs`.

- `smoke` (aka `e2e`) for testing the whole plugin behaviour. If your changes affect the CLI or options, then you will need to update those tests. Smoke tests live in `tests/e2e/` and are split by package (`cli/` and `docusaurus/`). Shared fixtures and helpers are in `tests/e2e/__data__/` and `tests/e2e/helpers/` (CLI runner and the Docusaurus test webpack plugin).

  > The tests scaffold throwaway CLI/Docusaurus projects and run automatically in CI on every pull request (see [`.github/workflows/smoke.yml`](.github/workflows/smoke.yml)). To reproduce a run locally, use the bundled script:
  >
  > ```shell
  > bun run smoke
  > ```
  >
  > Run it with no arguments for an interactive menu (CLI, Docusaurus 2, Docusaurus 3, or all), or pass a target non-interactively:
  >
  > ```shell
  > bun run smoke -- cli
  > bun run smoke -- docusaurus2
  > bun run smoke -- docusaurus3
  > bun run smoke -- all
  > ```
  >
  > A second argument selects the GraphQL major version to install (`16` or `17`, default `16`), and applies to every suite, including `all`:
  >
  > ```shell
  > bun run smoke -- all 17
  > ```
  >
  > The script builds and packs the workspace once, then scaffolds each selected suite into its own throwaway project under a fresh scratch directory (printed at the end of the run — left in place for debugging, not auto-removed). Must be run from the repository root; `REPO_ROOT` can be overridden if needed.

#### Test configuration

Every package's `vitest.config.mjs` is a thin wrapper around `createPackageConfig` in [`packages/tooling-config/vitest/base.mjs`](packages/tooling-config/vitest/base.mjs) — change shared test behaviour there rather than in a package.

Two settings in it are load-bearing for how fast the suite runs:

- tests run on Vitest's `threads` pool, which is safe because every package tests plain Node code with no native addon and no `process.chdir`. If you add a test that needs a real child process, override `pool` in that package's config rather than in the shared base;
- `isolate` stays `true`, deliberately. Turning it off saves ~160ms across the workspace (1.82s → 1.66s), and in exchange `printer-legacy` fails nondeterministically — four identical runs produced 35, 46, 41 and 5 failures, since which test files share a worker changes between runs. The other nine packages are already clean. The coupling is the `Printer` class's mutable static state, which only `printer.test.ts` resets, plus a few `vi.mock` factories that replace a module's whole surface instead of spreading `importOriginal()`. Both are worth fixing so tests do not depend on each other, but not in pursuit of 160ms.

`test:ci` shuffles file order (`--sequence.shuffle`) to catch tests that depend on running after another file. If a test only passes in a particular order, fix the test rather than the flag.

#### Mutation testing

The project uses [Stryker Mutator](https://stryker-mutator.io/docs/stryker-js/introduction/) for mutation testing against unit tests. The purpose is to ensure that unit tests can capture changes in the code, i.e. not just "always pass".

As a contributor, you do not need to do anything. However, if the mutation testing score falls below a certain threshold when running mutation tests against your PR, this likely means that you need to improve your tests (even if the test coverage is good).

Mutation testing can be run locally with the command:

```shell
bun run stryker
```

You can read more about [mutation testing here](https://stryker-mutator.io/docs/).

### Build documentation

> The documentation is automatically generated and published when a new release is created.

You can build the documentation locally with the command (run from the repository root):

```shell
./website/scripts/build-docs.sh /tmp/graphql-markdown-docs-build
```

You can then serve the built site locally:

```shell
cd website && npm run serve
```

### API Documentation

Generate API documentation for packages:

```shell
# Generate docs for all packages
bun run docs
```

The generated documentation will be available in each package's `docs/` directory.

### Publishing Packages

> **Important**: This section is for maintainers with npm publish access.

The monorepo uses `workspace:^` protocol for inter-package dependencies. These must be resolved to actual version numbers before publishing to npm.

**⚠️ Never use `npm publish` directly from a package directory** - it will publish unresolved `workspace:^` dependencies, breaking the package for users.

#### Correct Publishing Process

1. **Build all packages first**:

  ```shell
  bun run build
  ```

2. **Use the publish scripts** (recommended):

  ```shell
  # Single package
  ./packages/tooling-config/scripts/publish-package.sh <package-name>
  ./packages/tooling-config/scripts/publish-package.sh --dry-run <package-name>

  # All packages for a release
  ./packages/tooling-config/scripts/publish-release.sh
  ./packages/tooling-config/scripts/publish-release.sh --dry-run
  ```

3. **Or manually with bun pack + npm publish tarball**:

  ```shell
  cd packages/<package-name>
  bun pm pack                    # Creates tarball with resolved deps
  npm publish <tarball.tgz> --access public
  ```

The publish scripts will:

- Pack with `bun pm pack` (resolves `workspace:^` to versions)
- Verify no `workspace:` references remain in the tarball
- Publish using the tarball (not from directory)
- Publish in correct dependency order

Use `--dry-run` to review the publish plan and validate the tarball flow without publishing anything.

#### Dependency Order for Publishing

Packages must be published in dependency order:

1. `types` (no internal deps)
2. `utils`, `logger`, `graphql`
3. `helpers`, `diff`
4. `formatters`
5. `printer-legacy`
6. `core`
7. `cli`
8. `docusaurus`

This is the order used by [`publish-release.sh`](packages/tooling-config/scripts/publish-release.sh); keep both in sync when adding a package.

### Troubleshooting

Common issues:

- **Type errors**: Check `tsconfig.json` in the affected package
- **Test failures**: Use the `--reporter=verbose` flag with Vitest for details
- **Dependency issues**: Clean install with `bun ci`

For other issues, please check existing GitHub issues or create a new one.
