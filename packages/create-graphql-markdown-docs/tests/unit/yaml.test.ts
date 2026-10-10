import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { toYaml } from "../../lib/wire/yaml.mjs";

const testDir = path.dirname(fileURLToPath(import.meta.url));

describe("toYaml", () => {
  it("round-trips the docusaurus template .graphqlrc", () => {
    const templatePath = path.join(
      testDir,
      "../../templates/docusaurus/.graphqlrc",
    );
    const obj = {
      schema: "./schema/example.graphql",
      extensions: {
        "graphql-markdown": {
          baseURL: ".",
          homepage: "static/index.md",
          loaders: {
            GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
          },
          docOptions: {
            frontMatter: { pagination_next: null, pagination_prev: null },
          },
          printTypeOptions: { deprecated: "group" },
        },
      },
    };
    expect(toYaml(obj)).toBe(fs.readFileSync(templatePath, "utf8"));
  });

  it("doubles single quotes inside strings", () => {
    expect(toYaml({ name: "it's" })).toBe("name: 'it''s'\n");
  });

  it("emits booleans, numbers and null bare", () => {
    expect(
      toYaml({
        enabled: true,
        disabled: false,
        count: 42,
        ratio: 0.5,
        none: null,
      }),
    ).toBe(
      "enabled: true\ndisabled: false\ncount: 42\nratio: 0.5\nnone: null\n",
    );
  });

  it("omits undefined values", () => {
    expect(toYaml({ a: "x", b: undefined })).toBe("a: 'x'\n");
  });

  it("emits empty nested objects as {}", () => {
    expect(toYaml({ options: {} })).toBe("options: {}\n");
  });

  it("quotes keys that do not match the bare key pattern", () => {
    expect(toYaml({ "a b": "c" })).toBe("'a b': 'c'\n");
  });

  it("serializes a loader with options nested three levels deep", () => {
    const obj = {
      loaders: {
        UrlLoader: {
          module: "@graphql-tools/url-loader",
          options: { method: "POST", token: "${API_TOKEN}" },
        },
      },
    };
    expect(toYaml(obj)).toBe(
      [
        "loaders:",
        "  UrlLoader:",
        "    module: '@graphql-tools/url-loader'",
        "    options:",
        "      method: 'POST'",
        "      token: '${API_TOKEN}'",
        "",
      ].join("\n"),
    );
  });

  it("throws a TypeError naming the key path for arrays", () => {
    expect(() => {
      return toYaml({ extensions: { "graphql-markdown": { x: [1, 2] } } });
    }).toThrow(TypeError);
    expect(() => {
      return toYaml({ extensions: { "graphql-markdown": { x: [1, 2] } } });
    }).toThrow("extensions.graphql-markdown.x");
  });

  it("throws a TypeError when the top level is not an object", () => {
    expect(() => {
      return toYaml("schema");
    }).toThrow(TypeError);
    expect(() => {
      return toYaml(["a"]);
    }).toThrow(TypeError);
  });
});
