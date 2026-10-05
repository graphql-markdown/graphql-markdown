// content.config.ts
//
// @nuxt/content scopes each layer's own content.config.ts to that layer's
// own rootDir, so a collection declared in the theme layer would only ever
// look for content inside the theme package itself, never in a consuming
// project. This file MUST exist in every consuming project (this fixture
// included) — see tests/fixture/content.config.ts for the full rationale.
import { defineContentConfig, defineCollection } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "api-reference/**/*.md",
    }),
  },
});
