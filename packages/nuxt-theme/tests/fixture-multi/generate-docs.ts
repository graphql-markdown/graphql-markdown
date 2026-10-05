import { createGenerateDocs } from "@graphql-markdown/nuxt-theme/generate";

const generateA = createGenerateDocs({
  schema: "../fixture/schema/fixture.graphql",
  baseURL: "api-reference/schema-a",
});
const generateB = createGenerateDocs({
  schema: "../fixture/schema/fixture.graphql",
  baseURL: "api-reference/schema-b",
});

export const generate = async () => {
  await generateA();
  await generateB();
};
