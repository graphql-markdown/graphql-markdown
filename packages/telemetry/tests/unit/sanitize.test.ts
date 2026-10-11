import { CLI_RULES, CONFIG_RULES, sanitizeConfig } from "../../src/sanitize";
import {
  ALLOWLIST,
  FORMATTER_PRESETS,
  KNOWN_LOADERS,
  MASK_TOKENS,
} from "../../src/schema";

const run = (value: unknown) => {
  return sanitizeConfig(value, CONFIG_RULES);
};

describe("sanitizeConfig masking table", () => {
  test("booleans, numbers and null pass through", () => {
    expect(run({ force: true, pretty: false, id: null }).value).toEqual({
      force: true,
      pretty: false,
      id: null,
    });
  });

  test("known enums pass through", () => {
    const { value } = run({
      diffMethod: "FORCE",
      printTypeOptions: { deprecated: "group", hierarchy: "flat" },
    });
    expect(value).toEqual({
      diffMethod: "FORCE",
      printTypeOptions: { deprecated: "group", hierarchy: "flat" },
    });
  });

  test("unknown enum value is masked", () => {
    expect(run({ diffMethod: "my-secret" }).value).toEqual({
      diffMethod: "<string>",
    });
  });

  test("urls, paths and strings are masked", () => {
    expect(
      run({
        baseURL: "https://corp.example.com",
        rootPath: "/Users/me/project",
        linkRoot: "docs",
        homepage: "./home.md",
        id: "secret-id",
      }).value,
    ).toEqual({
      baseURL: "<url>",
      rootPath: "<path>",
      linkRoot: "<path>",
      homepage: "<path>",
      id: "<string>",
    });
  });

  test("homepage false passes", () => {
    expect(run({ homepage: false }).value).toEqual({ homepage: false });
  });

  test.each(FORMATTER_PRESETS)("formatter preset %s passes", (preset) => {
    expect(run({ formatter: preset }).value).toEqual({ formatter: preset });
  });

  test("@graphql-markdown packages pass, custom formatters are masked", () => {
    expect(
      run({ formatter: "@graphql-markdown/formatters/docusaurus" }).value,
    ).toEqual({ formatter: "@graphql-markdown/formatters/docusaurus" });
    expect(run({ formatter: "@graphql-markdown/docusaurus" }).value).toEqual({
      formatter: "@graphql-markdown/docusaurus",
    });
    for (const f of [
      "docusaurus-graphql-formatter",
      "./my-formatter.mjs",
      "/abs/f.js",
      "https://x.test/f.js",
    ]) {
      expect(run({ formatter: f, mdxParser: f }).value).toEqual({
        formatter: "<custom-formatter>",
        mdxParser: "<custom-formatter>",
      });
    }
  });

  test("directive names and arrays keep length", () => {
    expect(
      run({ skipDocDirective: ["a", "b"], onlyDocDirective: "c" }).value,
    ).toEqual({
      skipDocDirective: ["<string>", "<string>"],
      onlyDocDirective: "<string>",
    });
  });

  test("groupByDirective keeps keys and masks values", () => {
    expect(
      run({ groupByDirective: { directive: "d", field: "f", fallback: "x" } })
        .value,
    ).toEqual({
      groupByDirective: {
        directive: "<string>",
        field: "<string>",
        fallback: "<string>",
      },
    });
  });

  test("user-defined keys become <key:n>", () => {
    expect(
      run({ customDirective: { myDirective: { descriptor: "x" } } }).value,
    ).toEqual({ customDirective: { "<key:0>": { "<key:0>": "<string>" } } });
  });

  test("functions and class instances", () => {
    class Adapter {}
    expect(
      run({
        outputAdapter: new Adapter(),
        decorators: {
          a: () => {
            return 1;
          },
        },
      }).value,
    ).toEqual({
      outputAdapter: "<object>",
      decorators: { "<key:0>": "<function>" },
    });
    expect(
      run({
        outputAdapter: {
          write: () => {
            return 1;
          },
        },
      }).value,
    ).toEqual({
      outputAdapter: "<object>",
    });
  });

  test("unknown top-level keys are dropped and counted", () => {
    const r = run({ force: true, bogus: "x", other: 1 });
    expect(r.value).toEqual({ force: true });
    expect(r.unknownKeys).toBe(2);
  });

  test("schema is classified, never sent", () => {
    expect(run({ schema: "https://x.test/graphql" }).value).toEqual({
      schema: "<url>",
    });
  });

  test("schema pointer forms become mask tokens", () => {
    const secret = "Bearer s3cr3t";
    const cases: [unknown, unknown][] = [
      ["git:main:schema.graphql", "<git>"],
      ["github:acme/repo#main:schema.graphql", "<github>"],
      ["./schema.graphql", "<file:sdl>"],
      ["/abs/schema.graphql", "<file:sdl>"],
      ["C:\\x\\schema.graphql", "<file:sdl>"],
      ["C:\\x\\schema.json", "<file:json>"],
      ["C:\\x\\schema.ts", "<file:code>"],
      ["C:\\x\\App.vue", "<file:code>"],
      ["src/**/*.graphql", "<glob>"],
      ["type Query { a: Int }", "<inline-sdl>"],
      [
        ["a.graphql", "https://x.test/g"],
        ["<file:sdl>", "<url>"],
      ],
    ];
    for (const [schema, expected] of cases) {
      expect(run({ schema }).value).toEqual({ schema: expected });
    }
    const out = JSON.stringify(
      run({
        schema: {
          "https://api.acme.internal/graphql": {
            headers: { Authorization: secret },
          },
        },
      }).value,
    );
    expect(out).toBe('{"schema":"<url>"}');
    expect(out).not.toContain(secret);
  });

  test("loaders: known pass, custom become <custom-loader>", () => {
    const { value } = run({
      loaders: {
        UrlLoader: "@graphql-tools/url-loader",
        AcmeLoader: { module: "@acme/loader", options: { token: "s3cret" } },
      },
    });
    expect(value).toEqual({
      loaders: {
        UrlLoader: "@graphql-tools/url-loader",
        "<custom-loader>": {
          module: "<custom-loader>",
          options: { "<key:0>": "<string>" },
        },
      },
    });
  });

  test("cli rules mask the same way", () => {
    expect(
      sanitizeConfig(
        { base: "https://x.test", root: "/a", skip: ["d"], force: true, no: 1 },
        CLI_RULES,
      ),
    ).toEqual({
      value: { base: "<url>", root: "<path>", skip: ["<string>"], force: true },
      unknownKeys: 1,
    });
  });

  test("allowlist exposes enums and mask tokens as plain data", () => {
    expect(JSON.parse(JSON.stringify(ALLOWLIST))).toMatchObject({
      maskTokens: [...MASK_TOKENS],
      knownLoaders: [...KNOWN_LOADERS],
    });
  });
});
