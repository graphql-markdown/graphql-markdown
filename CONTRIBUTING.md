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
- [docker](https://www.docker.com/products/docker-desktop) or [podman](https://podman.io/getting-started/installation)\*
- [earthly](https://earthly.dev/get-earthly)
- [typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [pnpm](https://pnpm.io/installation) (recommended)

This project is fully compatible with [GitHub Codespaces](https://github.com/features/codespaces). However, if you prefer a local environment, then we recommend [VS Code](https://code.visualstudio.com/download) for this project.

_\* For using `podman` with `earthly`, you need to run `earthly config global.container_frontend podman-shell` (see [earthly ticket](https://github.com/earthly/earthly/issues/760#issuecomment-932323241))._

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
  npm install
  ```

- from the local folder, check that everything is working

  ```shell
  earthly +all
  ```

## Make your changes

> **Keep changes small and focused.** This means a pull request should only aim at one purpose: fixing a typo in the documentation, fixing one bug at a time, changing one behaviour.

### Documentation

The project uses Markdown for writing documentation ([doc](https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/about-writing-and-formatting-on-github)).

You should edit the documentation or add new documentation files directly in your branch from your GitHub fork.

### Code

> We are using a monorepo, so you might want to [read about monorepo](https://monorepo.tools/) before jumping into the code.

The code base is full TypeScript using NodeJS, and Jest for tests. The codebase can seem a bit messy, so start by reading the section [coding style](#coding-style).

When making your changes, remember to check your code by running:

- `npm run ts:check` checks that the code is TS compliant
- `npm run lint` checks that the code respects coding standards (ESLint + Prettier)
- `npm test` runs the test suites
- `earthly +smoke-[cli|docusaurus]-test` runs smoke tests for CLI or Docusaurus (includes packages build)

When you are ready, you should then run the full checks with `earthly +all`.

> Note that `npm run ts:check`, `npm run lint` and `npm test` will be automatically triggered when committing code, and `earthly +all` will be automatically triggered when pushing local code to the remote repository.

### Committing changes

This project uses the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format for commit messages. When you run `git commit`, [commitizen](https://commitizen.github.io/cz-cli/) will be automatically triggered, and you should get some prompts on the terminal that help you write a good commit message.

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
- `diff` - Schema diffing (optional)
- `helpers` - Directive helpers (optional)

Each package contains:
```
package/
├── src/         # Source code
├── tests/       # Test files
├── docs/        # API documentation
└── package.json # Package manifest
```

> The project uses classes; it is for historical reasons, and that was not necessarily a good choice. So, you should not feel obliged to do the same.

### Dependencies

As a rule of thumb, try to avoid adding external packages unless you have a really good reason.

For example, it is very tempting to use `lodash`, but usually developers only need one or two functions from it. In many cases, this can be replaced by a custom function, but if you cannot, then always prefer individual packages, e.g. `lodash.get`.

When choosing an external package, always look at the following:

- Is it maintained? last release, last commit, last reply to an issue
- What is the size? The smaller the better
- How many dependencies? the lesser the merrier

### Tests

There are a lot of ways to test your code, and you should always add tests when making changes to the code.

There are 3 types of tests used in this project, all based on [Jest](https://jestjs.io/):

- `unit` for testing individual units of code (class methods and functions). If your changes are located in `src/utils`, then this is likely where you should add your tests.

  > You should always mock external calls (see [Jest mock](https://jestjs.io/docs/mock-functions)).

- `integration` for testing the logic of the main classes. If your changes are located in `src/lib`, then you will need to add your tests here.

  > If your tests interact with the filesystem, then you should make use of file system mocking with `memfs`.

- `smoke` (aka `e2e`) for testing the whole plugin behaviour. If your changes affect the CLI or options, then you will need to update those tests.

  > The tests run within a Docker container using Earthly.

#### Mutation testing

The project uses [Stryker Mutator](https://stryker-mutator.io/docs/stryker-js/introduction/) for mutation testing against unit tests. The purpose is to ensure that unit tests can capture changes in the code, i.e. not just "always pass".

As a contributor, you do not need to do anything. However, if the mutation testing score falls below a certain threshold when running mutation tests against your PR, this likely means that you need to improve your tests (even if the test coverage is good).

Mutation testing can be run locally with the command:

```shell
earthly +mutation-test
```

You can read more about [mutation testing here](https://stryker-mutator.io/docs/).

### Build documentation

> The documentation is automatically generated and published when a new release is created.

You can build the documentation locally with the command:

```shell
earthly +build-docs
```

You can also create a local container image `graphql-markdown:docs` for tests:

```shell
earthly +build-image
docker run --rm -it -p 8080:8080 graphql-markdown:docs
```

### API Documentation

Generate API documentation for packages:

```shell
# Generate docs for all packages
npm run docs:api:all
```

The generated documentation will be available in each package's `docs/` directory.

### Troubleshooting

Common issues:

- **Build failures**: Run `earthly --interactive [target]` then retry
- **Type errors**: Check `tsconfig.json` in the affected package
- **Test failures**: Use `--verbose` flag with Jest for details
- **Dependency issues**: Clean install with `npm ci`

For other issues, please check existing GitHub issues or create a new one.
