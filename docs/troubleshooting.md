---
sidebar_position: 90
pagination_prev: null
pagination_next: null
description: Solutions for common GraphQL-Markdown issues including duplicate graphql modules, missing type definitions, and configuration problems.
keywords:
  - GraphQL-Markdown troubleshooting
  - common errors
  - debugging
  - graphql module errors
  - type definitions
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Troubleshooting

Fixes for common errors when generating documentation. Find your error message below, or see the end of the page for how to get help.

## Duplicate "graphql" modules cannot be used at the same time

Add a `resolutions` entry to your `package.json`:

```json title="package.json"
"resolutions":
{
  "graphql": "16.14.2"
}
```

## Unable to find any GraphQL type definitions

Try these solutions:

1. Change the temporary folder location:

```js
{
  tmpDir: "./.docusaurus";
}
```

1. Disable schema diff feature:

```js
{
  diffMethod: "NONE";
}
```

1. Check file permissions on the temporary directory

## Schema loading issues

1. Ensure required loaders are installed:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm install @graphql-tools/url-loader @graphql-tools/json-file-loader
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm add @graphql-tools/url-loader @graphql-tools/json-file-loader
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn add @graphql-tools/url-loader @graphql-tools/json-file-loader
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun add @graphql-tools/url-loader @graphql-tools/json-file-loader
```

</TabItem>
</Tabs>

1. Verify loader configuration:

```js
{
  loaders: {
    UrlLoader: "@graphql-tools/url-loader",
    JsonFileLoader: "@graphql-tools/json-file-loader"
  }
}
```

## "UrlLoader" does not exist in type "LoaderOption".ts

_Reported in [#2213](https://github.com/graphql-markdown/graphql-markdown/issues/2213)._

```text
Object literal may only specify known properties, and 'UrlLoader' does not exist in type 'LoaderOption'.ts(2353)
core.d.ts(128, 3): The expected type comes from property 'loaders' which is declared here on type 'ConfigOptions'
```

Cast the `loaders` as `LoaderOption`:

```ts
loaders: {
  UrlLoader: {
    module: "@graphql-tools/url-loader",
    options: {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      },
    },
  },
} as LoaderOption,
```

## Memory issues during generation

For large schemas, increase the Node.js memory limit:

```shell
NODE_OPTIONS=--max-old-space-size=4096 npx docusaurus graphql-to-doc
```

## Getting help

If you're still having issues:

1. Check the [GitHub issues](https://github.com/graphql-markdown/graphql-markdown/issues)
2. File a new issue with:
   - Your configuration
   - Schema size/complexity
   - Error messages
   - Node.js and package versions
