---
sidebar_position: 20
description: Scaffold or extend a Nuxt-based GraphQL API reference site with the @graphql-markdown/nuxt-theme layer and its create-graphql-markdown-docs CLI.
keywords:
  - GraphQL-Markdown Nuxt
  - Nuxt layer
  - Nuxt Content
  - Nuxt UI
  - create-graphql-markdown-docs
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Nuxt theme

`@graphql-markdown/nuxt-theme` is a [Nuxt layer](https://nuxt.com/docs/guide/going-further/layers) that turns a GraphQL schema into a full API reference site. It provides a two-column layout (prose on the left, schema definitions and examples on the right), navigation, search, and generation.

Extend it from your own Nuxt project instead of building on the CLI's raw Markdown output. This is the recommended path for a [Nuxt](https://nuxt.com) stack; see [Integration with frameworks](/docs/guides/other-frameworks) for the others.

## Fastest path: the scaffolding CLI

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm create graphql-markdown-docs@latest
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm create graphql-markdown-docs
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn create graphql-markdown-docs
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun create graphql-markdown-docs
```

</TabItem>
</Tabs>

It asks a few questions (project directory, schema source, package manager, optional title and color) and produces a ready-to-run project. See [Getting started](/docs/get-started#create-a-new-site) for the full prompt and flag reference, including non-interactive usage, or the [`create-graphql-markdown-docs` README](https://github.com/graphql-markdown/graphql-markdown/tree/main/packages/create-graphql-markdown-docs).

## Extending the layer directly

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm install @graphql-markdown/nuxt-theme
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm add @graphql-markdown/nuxt-theme
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn add @graphql-markdown/nuxt-theme
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun add @graphql-markdown/nuxt-theme
```

</TabItem>
</Tabs>

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["@graphql-markdown/nuxt-theme"],
});
```

Two files are required in your own project — not inherited from the layer:

```ts
// content.config.ts
import { defineContentConfig, defineCollection } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "api-reference/**/*.md",
    }),
  },
});
```

```ts
// generate-docs.ts
import { createGenerateDocs } from "@graphql-markdown/nuxt-theme/generate";

export const generate = createGenerateDocs({
  schema: "./schema/your-schema.graphql",
});
```

`content.config.ts` has to live in your own project. Nuxt Content scopes each layer's `content.config.ts` to that layer's directory, so a collection declared only in the theme would never see the files your project generates.

`generate-docs.ts` is invoked automatically by the layer's Nuxt module, before Nuxt Content indexes the directory. So `npm run dev`, `generate` and `build` all work from a fresh clone with nothing generated yet. You don't need a `build:before` hook of your own.

### Passing schema loading options

`createGenerateDocs` accepts the same `printTypeOptions`, `decorators`, and `loaders` you'd pass to [`runGraphQLMarkdown`](/docs/guides/additional-schema). The schema can be a local file, a URL, or anything a [graphql-tools loader](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders) can read:

```ts
export const generate = createGenerateDocs({
  schema: "https://api.example.com/graphql",
  loaders: { UrlLoader: "@graphql-tools/url-loader" },
});
```

## Customizing

- **Config and CSS** — site title, GitHub link, Shiki theme, and a set of `--gqlmd-*` CSS custom properties for badge/callout/sidebar styling. No file copying, survives layer upgrades.
- **Swizzling** — for changes config can't reach (different markup, a different component entirely), eject a single component into your own project with the bundled `gqlmd-swizzle` CLI. The ejected copy is version-stamped so you can tell when it's drifted from a newer layer release.

Both are documented in full, with every config key and CSS property listed, in [`@graphql-markdown/nuxt-theme`'s own README](https://github.com/graphql-markdown/graphql-markdown/tree/main/packages/nuxt-theme).

## What's fixed, not configurable, in this version

- The content collection is always named `content`, and generated pages always live under `api-reference/`, because the navigation and search UI assume this path.
- Multiple schemas on one site aren't supported by the navigation yet, even though `generate-docs.ts` can call `createGenerateDocs` more than once.
- The reference page's code-column extraction assumes graphql-markdown's default section/heading structure — unusual `decorators`/`customSections` positions can render into the wrong place.
