import { describe, expect, test } from "vitest";

import { runtimeModuleSpecifier as utilsRuntimeModuleSpecifier } from "@graphql-markdown/utils";

import { runtimeModuleSpecifier } from "../../src";

describe("runtimeModuleSpecifier", () => {
  test("re-exports the @graphql-markdown/utils function", () => {
    expect(runtimeModuleSpecifier).toBe(utilsRuntimeModuleSpecifier);
  });
});
