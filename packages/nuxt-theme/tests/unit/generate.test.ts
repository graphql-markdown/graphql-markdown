import { describe, it, expect, vi, beforeEach } from "vitest";

const runGraphQLMarkdown = vi.fn(async () => {});

vi.mock("@graphql-markdown/cli", () => ({
  runGraphQLMarkdown: (...args: unknown[]) => runGraphQLMarkdown(...args),
}));

vi.mock("@nuxt/kit", () => ({
  useLogger: () => ({ info: vi.fn(), error: vi.fn() }),
}));

const { createGenerateDocs } = await import("../../generate");

describe("createGenerateDocs", () => {
  beforeEach(() => {
    runGraphQLMarkdown.mockClear();
  });

  it("returns a callable function", () => {
    const generate = createGenerateDocs({ schema: "./schema.graphql" });
    expect(typeof generate).toBe("function");
  });

  it("produces the documented defaults when called with only `schema`", async () => {
    const generate = createGenerateDocs({ schema: "./schema.graphql" });
    await generate();

    expect(runGraphQLMarkdown).toHaveBeenCalledTimes(1);
    const [options] = runGraphQLMarkdown.mock.calls[0]!;

    expect(options).toMatchObject({
      schema: "./schema.graphql",
      rootPath: "./content",
      baseURL: "api-reference",
      linkRoot: "/",
      loaders: { GraphQLFileLoader: "@graphql-tools/graphql-file-loader" },
      printTypeOptions: { parentTypePrefix: false, typeBadges: true },
    });
    expect(options.formatter).toMatch(/formatter\.(ts|js)$/);
    expect(options.formatter).toMatch(/^file:\/\//);
  });

  it("merges printTypeOptions with the layer's defaults instead of replacing them", async () => {
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      printTypeOptions: { exampleSection: { directive: "example" } },
    });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.printTypeOptions).toMatchObject({
      parentTypePrefix: false,
      typeBadges: true,
      exampleSection: { directive: "example" },
    });
  });

  it("passes through decorators untouched, with no default", async () => {
    const decorators = {
      customTag: {
        predicate: () => true,
        position: { into: "tags" as const },
        render: () => "custom",
      },
    };
    const generate = createGenerateDocs({ schema: "./schema.graphql", decorators });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.decorators).toBe(decorators);
  });

  it("omits `decorators` entirely from options when not provided", async () => {
    const generate = createGenerateDocs({ schema: "./schema.graphql" });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options).not.toHaveProperty("decorators");
  });

  it("respects an explicit rootPath, loaders, and formatter override", async () => {
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      rootPath: "./custom-content",
      loaders: { CustomLoader: "@custom/loader" },
      formatter: "custom-formatter.ts",
    });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.rootPath).toBe("./custom-content");
    expect(options.loaders).toEqual({ CustomLoader: "@custom/loader" });
    expect(options.formatter).toBe("custom-formatter.ts");
  });

  it("wraps a generation failure in a descriptive error", async () => {
    runGraphQLMarkdown.mockRejectedValueOnce(new Error("boom"));
    const generate = createGenerateDocs({ schema: "./schema.graphql" });

    await expect(generate()).rejects.toThrow("GraphQL Markdown generation failed");
  });

  it("passes through a custom baseURL when provided", async () => {
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      baseURL: "custom-root",
    });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.baseURL).toBe("custom-root");
  });

  it("uses the default baseURL when not provided", async () => {
    const generate = createGenerateDocs({ schema: "./schema.graphql" });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.baseURL).toBe("api-reference");
  });
});
