# How to contribute

Thank you for reading this, all contributions, issues and feature requests are always very welcome.

The project is currently organized as a [NPM workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaces) with 3 packages:

- `graphql-markdown` is the NodeJS engine for generating Markdown from a GraphQL schema using [ETA](https://eta.js.org/) template engine for layouts,
- `graphql-markdown-cli` is the command line tool allowing to use `graphql-markdown` from the shell,
- `docusaurus2-graphql-doc-generator` is the implementation of `graphql-markdown` for [Docusaurus](https://docusaurus.io/) using custom layouts.

Some useful resources:

- [`GraphQL Config`](https://graphql-config.com) is the configuration library,
- [`GraphQL Tools`](https://www.graphql-tools.com/docs/schema-loading) is used for loading GraphQL schema from various sources,
- [`ETA`](https://eta.js.org/) is the template engine for rendering content,
- [`Jest`](https://jestjs.io/) is the testing framework for all type of tests.

## Testing

I am trying to keep a high level of testing using [Jest](https://jestjs.io/) and Stryker. If you submit a code contributions, then please ensure that you have added or updated required tests.

All tests are included in the [GitHub action workflows](https://github.com/edno/graphql-markdown/tree/main/.github/workflows) and executed on every push. The exception are the mutation tests executed only when pushing code to the `main` branch.

If you spot some missing tests, or improvements, we will gladly accept a pull request, for which we will love you forever as we can always use better test coverage.

## Submitting changes

When your change is ready, please remember to run the linter checks and tests before creating a Pull Request:

- `npm run lint --fix` checks that your code is a good it can be as per our [ESLint](https://eslint.org/) conventions,
- `npm run prettier` makes your code pretty and nice to review,
- `npm run test` runs a bunch of tests, hopefully all pass including the ones you might have added or updated,
- `npm run test:e2e` runs the end-to-end test suite, this is especially useful for major changes,
- `npm run test:stryker` (optional) runs the mutation tests, you should run it if you want to improve the tests (always good to run once, but it can take up to 15 minutes).

Please send a [GitHub Pull Request](https://github.com/edno/graphql-markdown/pull/new/main) with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

    $ git commit -m "A brief summary of the commit
    > 
    > A paragraph describing what changed and its impact."

## Coding conventions

Read the project code and get familiar with the style. If you feel something can be done in a better way, then your suggestion will be welcome.

Most of the coding conventions are included into the [EditorConfig](https://editorconfig.org/) file [`.editorconfig`](https://github.com/edno/graphql-markdown/blob/main/.editorconfig), and in the [ESLint](https://eslint.org/) set of rules [`.eslintrc.cjs`](https://github.com/edno/graphql-markdown/blob/main/.eslintrc.cjs). This way, your IDE will provides you all necessary guidance.

In addition, to them, I am opinionated on the following:

- code should be atomic, i.e. your methods and functions should do only one thing, so they can do it well, and are easy to test,
- types [Typescript](https://www.typescriptlang.org/) should be defined before hand to make them easily reusable, including in tests
- tests should be atomic, i.e. avoid one test fits all, mocking is always welcome,
- errors and edges cases exists, users will always go beyond the intended design and the GraphQL specification is evolving, so remember to handle them and to test them,
- external dependencies should be avoided, and cost versus benefits should be documented in the pull request if a dependency is added.

Last, but not least, please **do not use `--no-verify`** when pushing code.

Thanks,
Gregory Heitz (@edno)
