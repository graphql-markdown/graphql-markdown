// @ts-check
import { mergeConfig } from "vitest/config";

import { createPackageConfig } from "@graphql-markdown/tooling-config/vitest/base";

// `@graphql-inspector/core` must share the inlined `graphql` instance with the
// schemas it diffs, otherwise the benchmarks fail with "Cannot use
// GraphQLObjectType from another module or realm" (unit tests mock it).
const config = mergeConfig(createPackageConfig("diff", import.meta.url), {
  test: { server: { deps: { inline: [/@graphql-inspector\//] } } },
});

export default config;
