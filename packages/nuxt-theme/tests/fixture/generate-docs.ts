import { createGenerateDocs } from "@graphql-markdown/nuxt-theme/generate";

export const generate = createGenerateDocs({
  schema: "./schema/fixture.graphql",
});
