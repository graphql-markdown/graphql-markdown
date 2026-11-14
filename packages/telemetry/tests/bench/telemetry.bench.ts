import { describe, test } from "vitest";

import type {
  CliOptions,
  ConfigOptions,
  TelemetryTrigger,
} from "@graphql-markdown/types";

import {
  buildPayload,
  classifyPointer,
  CLI_RULES,
  CONFIG_RULES,
  fingerprint,
  sanitizeConfig,
} from "../../src";

const config = {
  baseURL: "/docs/graphql",
  diffMethod: "SCHEMA-DIFF",
  docOptions: {
    frontMatter: { sidebar_class_name: "graphql", pagination_next: null },
    index: true,
    generatorFrameworkName: "docusaurus",
    generatorFrameworkVersion: "3.9.0",
    categorySort: "natural",
  },
  force: false,
  groupByDirective: { directive: "doc", field: "category", fallback: "misc" },
  homepage: "./docs/index.md",
  id: "default",
  linkRoot: "/",
  loaders: {
    GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
    UrlLoader: {
      module: "@graphql-tools/url-loader",
      options: { headers: { Authorization: "secret" } },
    },
  },
  metatags: [{ name: "robots", content: "noindex" }],
  onlyDocDirective: ["doc"],
  pretty: true,
  printTypeOptions: {
    deprecated: "group",
    exampleSection: { directive: "example" },
    hierarchy: "api",
    parentTypePrefix: true,
    typeBadges: true,
  },
  rootPath: "./docs",
  schema: ["./schema/**/*.graphql", "https://example.com/graphql"],
  skipDocDirective: ["noDoc"],
  telemetry: true,
  tmpDir: "./.docusaurus/.tmp",
  unknownOption: "dropped",
} as unknown as ConfigOptions;

const cli = {
  base: "/docs/graphql",
  config: "./.graphqlrc.yml",
  deprecated: "skip",
  force: true,
  pretty: true,
  schema: "./schema.graphql",
} as unknown as CliOptions;

const pointers: unknown[] = [
  "./schema.graphql",
  "./schema/**/*.graphql",
  "https://example.com/graphql",
  "github:owner/repo#main:schema.graphql",
  "git:main:schema.graphql",
  "./introspection.json",
  "./src/schema.ts",
  "type Query { hello: String }",
  { "https://example.com/graphql": { headers: { Authorization: "secret" } } },
  ["./a.graphql", "./b.gql", "https://example.com/graphql"],
];

const payload = buildPayload({
  trigger: "cli" as TelemetryTrigger,
  pkg: "@graphql-markdown/cli",
  pkgVersion: "1.30.2",
  graphqlMajor: 16,
  config,
  cli,
  env: {},
});

describe("@graphql-markdown/telemetry", () => {
  test("sanitize", async ({ bench }) => {
    await bench.compare(
      bench("sanitizeConfig (config options)", () => {
        sanitizeConfig(config, CONFIG_RULES);
      }),
      bench("sanitizeConfig (CLI options)", () => {
        sanitizeConfig(cli, CLI_RULES);
      }),
      bench("classifyPointer for every pointer kind", () => {
        for (const pointer of pointers) {
          classifyPointer(pointer);
        }
      }),
    );
  });

  test("payload", async ({ bench }) => {
    await bench.compare(
      bench("buildPayload (config and CLI options)", () => {
        buildPayload({
          trigger: "cli" as TelemetryTrigger,
          pkg: "@graphql-markdown/cli",
          pkgVersion: "1.30.2",
          graphqlMajor: 16,
          config,
          cli,
          pages: 120,
          durationMs: 1234,
          env: {},
        });
      }),
      bench("fingerprint", () => {
        fingerprint(payload);
      }),
    );
  });
});
