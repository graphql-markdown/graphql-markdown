# Contributing guide

First thing first, thank you for taking the time to contribute.

Take this document as a set of guidelines, not rules, for contributing to this project. In any case, use your best judgement and feel free to propose changes to this document in a pull request.

> If this is your first time contribution to an open source project, then you should start with the section [First time contributor](#first-time-contributor), and then continue with [Getting started](#getting-started).

**Don't forget to read our [code of conduct](CODE_OF_CONDUCT.md).**

## Table of Contents

* [First time contributor](#first-time-contributor)
* [Getting started](#getting-started)
  * [Pre-requisites](#pre-requisites)
  * [Create a repository branch](#create-a-repository-branch)
* [Make your changes](#make-your-changes)
  * [Documentation](#documentation)
  * [Code](#code)
* [Coding style](#coding-style)
  * [Code structure](#code-structure)
  * [Dependencies](#dependencies)
  * [Tests](#tests)

## First time contributor

We all started somewhere. And, before getting started, you might want to be familiar with some of the basic concepts used in open source projects:

* code versioning with Git
* project forking with Github
* pushing a pull request with Github

Many people did a great job at explaining those concepts, here a few resources:

* [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/): a guide to making open source contributions
* [Hello Open Source](https://github.com/mazipan/hello-open-source): a repository to learn about open source code contributions flow
* [First Contributions](https://github.com/firstcontributions/first-contributions): a repository to learn how to make your first contribution

You are now all set for your first contribution :tada:

## Getting started

### Pre-requisites

If you aim at a code contribution, you will need the following tools:

* [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) (macOS and Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows) (Windows)
* [yarn](https://classic.yarnpkg.com/lang/en/docs/install/)
* [docker](https://www.docker.com/products/docker-desktop)
* [earthly](https://earthly.dev/get-earthly)

If you do not yet have an IDE, then I recommend [VS Code](https://code.visualstudio.com/download) for this project.

### Create a repository branch

* Fork this repository ([doc](https://docs.github.com/en/get-started/quickstart/fork-a-repo))
* Create a new branch in your forked repository ([doc](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository))
  * We are using a branch naming convention:
    * feature: `feature/short-description-of-the-change`
    * fix: `fix/short-description-of-the-fix` , you can also reference an existing issue, eg `fix/issue-456`
    * documentation: `doc/short-description-of-the-change`

If you aim at a code contribution, you will need few additional steps:

* checkout your forked repository to your computer ([doc](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)).

* install the node version defined in `.nvmrc` using nvm

  ```shell
  nvm install
  nvm use
  ```

* from the local folder, install repository packages

  ```shell
  yarn install
  ```

* from the local folder, check that everything is working

  ```shell
  earthly +all 
  ```

## Make your changes

> **Keep changes small and focused.** This means a pull request should only aim at one purpose: fixing typo in the documentation, fixing one bug at a time, changing one behaviour.

### Documentation

The project uses Markdown for writing documentation ([doc](https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/about-writing-and-formatting-on-github)).

> Do not change content the `docs` folder. This folder contains the pages of the website and it is auto-generated using Docusaurus.

You should edit the documentation, or add new documentation files, directly on your branch from you Github fork.

### Code

The code base is full Javascript using NodeJS, and Jest for tests. The codebase can seems a bit messy, so start by reading the section [coding style](#coding).

When making your changes, remember to check your code by running:

* `yarn lint` checks that the code respects Javascript standards.
* `yarn test` runs the test suites.

When you are ready, you should then run the full checks with `earthly +all`.

> Note that `earthly +all` will be automatically triggers when pushing local code to the remote repository.

## Coding style

> You will certainly find awkward construction and patterns, and you should feel free to improve the existing code.

### Code structure

The quickest way to understand the code structure is to look at the folder structure:

* `src` contains all JS files used by the plugin.
  * `index.js` is the plugin entrypoint.
  * `lib` contains all classes used for reading schema and generating markdown.
    * `generator.js` is controlling the logic, sequencing the calls to other classes.
    * `printer.js` is the class transforming GraphQL nodes into Markdown.
    * `renderer.js` is responsible for generating Markdown file structure, and other Docusaurus files.
    * `diff.js` contains method for identifying schema changes.
  * `utils` contains some utilities for manipulating basic structures such as `object`, `array`, `string` and `url` , and some helpers for `diff` and `prettier` .
* `tests` contains all tests needed (see [tests](#tests) section).
* `assets` contains assets used by the plugin, e.g. the default homepage `generated.md`.
* `scripts` contains a few scripts used by Github Actions and Docker.
* `docs` contains Docusaurus generated documentation - **DO NOT MODIFY MANUALLY**.

> The project uses classes, it is for historical reason and that was not necessarily a good choice. So, you should not feel obliged to do the same.

### Dependencies

As a rule of thumb, try to avoid adding external packages unless you have a really good reason.

For example, it is very tempting to use `lodash`, but usually developers only need one or two functions from it. In many case, this can be replace by a custom function, but if you cannot then always prefer individual packages, e.g. `lodash.get`.

When choosing an external packages, always look at the following:

* is it maintained? last release, last commit, last reply to an issue
* what is the size? the smaller the better
* how many dependencies? the lesser the merrier

### Tests

There are a lot of way to test your code, and you should always add tests when making change into the code.

There are 3 types of tests using in this project, all based on Jest:

* `unit` for testing individual units of code (class methods and functions). If your changes are located in `src/utils` then this is likely where you should add your tests.

  > You should always mock external calls (see [Jest mock](https://jestjs.io/docs/mock-functions)).

* `integration` for testing the logic of the main classes. If your changes are located `src/lib` then you will need to add your tests here.

  >  If your tests interact with the filesystem, then you should make use of file system mocking with `mock-fs`.

* `smoke` (aka `e2e`) for testing the whole plugin behaviour. If your changes affect the CLI or options then you will need to update those tests.

  > The tests run within a Docker container.

### Build documentation

You can build the documentation with the command:

```shell
earthly +build-demo
```

This will update documentation into `docs` folder, and it will also create a local Docker image `graphql-markdown:demo` for local tests:

```shell
docker --rm -it -p 8080:8080 run graphql-markdown:demo
```
