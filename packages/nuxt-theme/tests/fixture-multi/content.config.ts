// content.config.ts
//
// @nuxt/content scopes each layer's own content.config.ts to that layer's
// own rootDir (verified by reading @nuxt/content/dist/module.mjs directly —
// `loader({ name: "content", cwd: layer.config.rootDir, ... })`), so a
// collection declared in the theme layer would only ever look for content
// inside the theme package itself, never in a consuming project. This file
// MUST exist in every consuming project (this fixture included) — it is not
// inherited from @graphql-markdown/nuxt-theme via `extends`, even though the
// theme package ships an identical copy at its own root for documentation.
import { defineContentConfig, defineCollection } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "api-reference/**/*.md",
    }),
  },
});
