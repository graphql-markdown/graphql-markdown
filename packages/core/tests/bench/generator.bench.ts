import { join } from "node:path";

import { beforeAll, describe, test, vi } from "vitest";

import type {
  ClassName,
  GeneratorOptions,
  OutputAdapter,
  PackageName,
} from "@graphql-markdown/types";

import { DEFAULT_OPTIONS, DiffMethod } from "../../src/config";
import { generateDocFromSchema } from "../../src/generator";

// Keeps generated pages in memory so the benchmark measures documentation
// generation rather than disk I/O.
const pages = new Map<string, string>();
const memoryOutputAdapter: OutputAdapter = {
  writeFile: async (filePath: string, content: string): Promise<void> => {
    pages.set(filePath, content);
  },
  ensureDir: async (): Promise<void> => {},
  readFile: async (filePath: string): Promise<string | undefined> => {
    return pages.get(filePath);
  },
};

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

const swapiOptions = createOptions("swapi.graphql");
const tweetOptions = createOptions("tweet.graphql");

describe("@graphql-markdown/core", () => {
  beforeAll(() => {
    // the generator reports its progress on the console
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  test("generateDocFromSchema", async ({ bench }) => {
    await bench.compare(
      bench("generate docs (swapi)", async () => {
        pages.clear();
        await generateDocFromSchema(swapiOptions);
      }),
      bench("generate docs (tweet)", async () => {
        pages.clear();
        await generateDocFromSchema(tweetOptions);
      }),
    );
  });
});
