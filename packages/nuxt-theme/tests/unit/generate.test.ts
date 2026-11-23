import { join } from "node:path";
import { describe, it, expect, vi, beforeEach } from "vitest";

const runGraphQLMarkdown = vi.fn(async (..._args: unknown[]) => {
  return { outputDir: join("./content", "api-reference") };
});

vi.mock("@graphql-markdown/cli", () => {
  return {
    runGraphQLMarkdown: async (...args: unknown[]) => {
      return runGraphQLMarkdown(...args);
    },
  };
});

const rename = vi.fn(async () => {});

vi.mock("node:fs/promises", () => {
  return {
    rename: async (...args: unknown[]) => {
      return rename(...args);
    },
  };
});

vi.mock("@nuxt/kit", () => {
  return {
    useLogger: () => {
      return { info: vi.fn(), error: vi.fn(), warn: vi.fn() };
    },
  };
});

const { createGenerateDocs } = await import("../../generate");

describe("createGenerateDocs", () => {
  beforeEach(() => {
    runGraphQLMarkdown.mockClear();
    rename.mockClear();
  });

  it("passes the nuxt telemetry trigger", async () => {
    await createGenerateDocs({ schema: "./schema.graphql" })();

    expect(runGraphQLMarkdown.mock.calls[0]![3]).toMatchObject({
      trigger: "nuxt",
    });
  });

  it("forwards a custom homepage and stores it as generated.md", async () => {
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      homepage: "./docs/intro.md",
    });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.homepage).toBe("./docs/intro.md");
    expect(rename).toHaveBeenCalledTimes(1);
    expect(rename).toHaveBeenCalledWith(
      join("./content", "api-reference", "intro.md"),
      join("./content", "api-reference", "generated.md"),
    );
  });

  it("renames the homepage in the output directory resolved by GraphQL-Markdown", async () => {
    // e.g. rootPath/baseURL set in GraphQL Config rather than in the module options
    runGraphQLMarkdown.mockResolvedValueOnce({
      outputDir: join("./docs", "graphql"),
    });
    await createGenerateDocs({
      schema: "./schema.graphql",
      homepage: "./docs/intro.md",
    })();

    expect(rename).toHaveBeenCalledWith(
      join("./docs", "graphql", "intro.md"),
      join("./docs", "graphql", "generated.md"),
    );
  });

  it("skips the rename when core did not render the homepage (ENOENT)", async () => {
    rename.mockRejectedValueOnce(
      Object.assign(new Error("missing"), { code: "ENOENT" }),
    );
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      homepage: "./docs/intro.md",
    });

    await expect(generate()).resolves.toBeUndefined();
  });

  it("fails generation when the homepage rename fails for another reason", async () => {
    rename.mockRejectedValueOnce(
      Object.assign(new Error("denied"), { code: "EACCES" }),
    );
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      homepage: "./docs/intro.md",
    });

    await expect(generate()).rejects.toThrow(
      "GraphQL Markdown generation failed",
    );
  });

  it("does not rename a homepage already named generated.md", async () => {
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      homepage: "./docs/generated.md",
    });
    await generate();

    expect(rename).not.toHaveBeenCalled();
  });

  it("forwards `homepage: false` without renaming anything", async () => {
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      homepage: false,
    });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.homepage).toBe(false);
    expect(rename).not.toHaveBeenCalled();
  });

  it("omits `homepage` from options when not provided", async () => {
    const generate = createGenerateDocs({ schema: "./schema.graphql" });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options).not.toHaveProperty("homepage");
    expect(rename).not.toHaveBeenCalled();
  });

  it("forwards `telemetry: false` to runGraphQLMarkdown", async () => {
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      telemetry: false,
    });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.telemetry).toBe(false);
  });

  // Unset options are omitted, so core applies GraphQL Config or the theme defaults
  it.each([
    "telemetry",
    "decorators",
    "baseURL",
    "rootPath",
    "formatter",
    "loaders",
    "printTypeOptions",
  ])("omits `%s` from options when not provided", async (key) => {
    const generate = createGenerateDocs({ schema: "./schema.graphql" });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options).not.toHaveProperty(key);
  });

  it("forwards `pretty` and `groupByDirective` to runGraphQLMarkdown", async () => {
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      pretty: true,
      groupByDirective: { directive: "group", field: "name" },
    });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.pretty).toBe(true);
    expect(options.groupByDirective).toEqual({
      directive: "group",
      field: "name",
    });
  });

  it("keeps the theme's linkRoot even when a cast option tries to override it", async () => {
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      linkRoot: "/other/",
    } as never);
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.linkRoot).toBe("/");
  });

  it("returns a callable function", () => {
    const generate = createGenerateDocs({ schema: "./schema.graphql" });
    expect(typeof generate).toBe("function");
  });

  it("passes the theme defaults as context defaults, not as options", async () => {
    const generate = createGenerateDocs({ schema: "./schema.graphql" });
    await generate();

    expect(runGraphQLMarkdown).toHaveBeenCalledTimes(1);
    const [options, , , context] = runGraphQLMarkdown.mock.calls[0]!;

    expect(options).toEqual({ schema: "./schema.graphql", linkRoot: "/" });
    expect(context.defaults).toMatchObject({
      rootPath: "./content",
      baseURL: "api-reference",
      loaders: { GraphQLFileLoader: "@graphql-tools/graphql-file-loader" },
      printTypeOptions: { parentTypePrefix: false, typeBadges: true },
    });
    // Loaded by a native import() from node_modules, where Node will not strip
    // types — the default must stay plain JS.
    expect(context.defaults.formatter).toMatch(/formatter\.mjs$/);
    expect(context.defaults.formatter).toMatch(/^file:\/\//);
  });

  it("forwards only the user printTypeOptions (defaults are merged by core)", async () => {
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      printTypeOptions: { exampleSection: { directive: "example" } },
    });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.printTypeOptions).toEqual({
      exampleSection: { directive: "example" },
    });
  });

  it("passes through hierarchy untouched", async () => {
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      printTypeOptions: { hierarchy: "entity" },
    });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.printTypeOptions).toEqual({
      hierarchy: "entity",
    });
  });

  it("passes through the object form of hierarchy (customized api group names) untouched", async () => {
    const hierarchy = { api: { operations: "api" } };
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      printTypeOptions: { hierarchy },
    });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.printTypeOptions).toEqual({
      hierarchy,
    });
  });

  it("passes through decorators untouched, with no default", async () => {
    const decorators = {
      customTag: {
        predicate: () => {
          return true;
        },
        position: { into: "tags" as const },
        render: () => {
          return "custom";
        },
      },
    };
    const generate = createGenerateDocs({
      schema: "./schema.graphql",
      decorators,
    });
    await generate();

    const [options] = runGraphQLMarkdown.mock.calls[0]!;
    expect(options.decorators).toBe(decorators);
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

    await expect(generate()).rejects.toThrow(
      "GraphQL Markdown generation failed",
    );
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
});
