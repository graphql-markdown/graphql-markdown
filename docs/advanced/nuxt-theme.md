---
description: Scaffold or extend a Nuxt-based GraphQL API reference site with the @graphql-markdown/nuxt-theme layer and its create-graphql-markdown-docs CLI.
keywords:
  - GraphQL-Markdown Nuxt
  - Nuxt layer
  - Nuxt Content
  - Nuxt UI
  - create-graphql-markdown-docs
---

# Nuxt Theme

`@graphql-markdown/nuxt-theme` is a [Nuxt layer](https://nuxt.com/docs/guide/going-further/layers) that turns a GraphQL schema into a full API reference site — the two-column layout (prose on the left, schema definitions and examples on the right), navigation, search, and generation are all provided. Extend it from your own Nuxt project instead of building a documentation site from scratch on top of the CLI's raw Markdown output.

This is the recommended path if your documentation stack is [Nuxt](https://nuxt.com) — see [Integration with Frameworks](./integration-with-frameworks) for the other supported stacks.

## Fastest path: the scaffolding CLI

```bash
npm create graphql-markdown-docs@latest
```

Answers a few prompts (project directory, schema source, package manager, optional title/color) and produces a ready-to-run project. See [`create-graphql-markdown-docs`](https://github.com/graphql-markdown/graphql-markdown/tree/main/packages/create-graphql-markdown-docs) for the full flag reference and non-interactive usage.

## Extending the layer directly

```bash
npm install @graphql-markdown/nuxt-theme
```

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
    content: defineCollection({ type: "page", source: "api-reference/**/*.md" }),
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

`content.config.ts` has to live in your own project because Nuxt Content scopes each layer's own `content.config.ts` to that layer's directory — a collection declared only inside the theme layer would never see the files your project generates. `generate-docs.ts` is invoked automatically by the layer's own Nuxt module at the right point in the build lifecycle (before Nuxt Content indexes the directory), so `npm run dev`/`generate`/`build` all work correctly from a fresh clone with nothing generated yet — no `build:before` hook of your own required.

### Passing schema loading options

`createGenerateDocs` accepts the same `printTypeOptions`, `decorators`, and `loaders` you'd pass to [`runGraphQLMarkdown`](./additional-schema) directly — the schema itself can be a local file, a URL, or anything else a [graphql-tools loader](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders) can read:

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

- The content collection is always named `content`, and generated pages always live under `api-reference/` — the navigation and search UI assume this path structure. Multiple schemas on one site aren't supported by the navigation yet, even though `generate-docs.ts` can call `createGenerateDocs` more than once.
- The reference page's code-column extraction assumes graphql-markdown's default section/heading structure — unusual `decorators`/`customSections` positions can render into the wrong place.
