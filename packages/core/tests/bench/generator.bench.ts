import { join } from "node:path";

import { beforeAll, describe, expect, test, vi } from "vitest";

import type {
  ClassName,
  GeneratorOptions,
  PackageName,
} from "@graphql-markdown/types";

import { Printer } from "@graphql-markdown/printer-legacy";
import { createMemoryOutputAdapter } from "@graphql-markdown/tooling-config/vitest/bench";

import { DEFAULT_OPTIONS, DiffMethod } from "../../src/config";
import { generateDocFromSchema } from "../../src/generator";

// Keeps generated pages in memory so page writes are excluded from the
// measurement. Each iteration still loads the schema file, so the benchmark
// covers end-to-end generation.
const { files: pages, outputAdapter: memoryOutputAdapter } =
  createMemoryOutputAdapter();

const createOptions = (schemaFile: string): GeneratorOptions => {
  return {
    ...DEFAULT_OPTIONS,
    baseURL: "graphql",
    diffMethod: DiffMethod.NONE,
    docOptions: {},
    homepageLocation: undefined,
    linkRoot: "docs",
    loaders: {
      ["GraphQLFileLoader" as ClassName]:
        "@graphql-tools/graphql-file-loader" as PackageName,
    },
    metatags: [],
    onlyDocDirective: [],
    outputAdapter: memoryOutputAdapter,
    outputDir: "/output",
    prettify: false,
    printer: "@graphql-markdown/printer-legacy" as PackageName,
    schemaLocation: join(__dirname, "../__data__", schemaFile),
    skipDocDirective: [],
    tmpDir: "/temp",
  } as GeneratorOptions;
};

// `Printer.init` only sets its static options when they are `undefined`, so
// without a reset every schema after the first would reuse the first schema's
// options. Resetting mirrors a fresh CLI process per schema.
const generate = async (options: GeneratorOptions): Promise<void> => {
  Printer.options = undefined;
  pages.clear();
  await generateDocFromSchema(options);
};

const swapiOptions = createOptions("swapi.graphql");
const tweetOptions = createOptions("tweet.graphql");

describe("@graphql-markdown/core", () => {
  beforeAll(() => {
    // the generator reports its progress on the console
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  test("generateDocFromSchema", async ({ bench }) => {
    await generate(swapiOptions);
    expect(pages.size).toBeGreaterThan(0);
    const swapiPaths = [...pages.keys()];

    await generate(tweetOptions);
    const tweetPaths = [...pages.keys()];
    expect(
      tweetPaths.some((path) => {
        return /tweet/i.test(path);
      }),
    ).toBe(true);
    expect(tweetPaths).not.toEqual(swapiPaths);

    await bench.compare(
      bench("generate docs (swapi)", async () => {
        await generate(swapiOptions);
      }),
      bench("generate docs (tweet)", async () => {
        await generate(tweetOptions);
      }),
    );
  });
});
