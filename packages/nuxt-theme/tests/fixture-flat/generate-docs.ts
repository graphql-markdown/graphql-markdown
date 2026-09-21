import { createGenerateDocs } from "@graphql-markdown/nuxt-theme/generate";

// hierarchy: "flat" is the thing this fixture exists to exercise — it's what
// makes the single-page reference view (see useHierarchyMode.ts) the
// exclusive view at the base route, in place of the per-type catalog that
// tests/fixture (default "api" hierarchy) still covers.
export const generate = createGenerateDocs({
  schema: "./schema/fixture.graphql",
  printTypeOptions: { hierarchy: "flat" },
});
