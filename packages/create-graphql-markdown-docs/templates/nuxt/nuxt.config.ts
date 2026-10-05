import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  extends: ['@graphql-markdown/nuxt-theme'],
  // The layer's gqlmd-generate module watches generate-docs.ts itself, but
  // has no way to know which schema file(s) it points at.
  watch: [fileURLToPath(new URL("./schema/example.graphql", import.meta.url))],
});
