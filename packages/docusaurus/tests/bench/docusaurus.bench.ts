import { describe, expect, test } from "vitest";

import { createMemoryOutputAdapter } from "@graphql-markdown/tooling-config/vitest/bench";

import { beforeGenerateIndexMetafileHook } from "../../src/mdx";

const CATEGORY_COUNT = 50;

// Keeps metafiles in memory so the benchmark measures the hook rather than
// disk I/O.
const { files, outputAdapter: memoryOutputAdapter } =
  createMemoryOutputAdapter();

const categories = Array.from({ length: CATEGORY_COUNT }, (_, index) => {
  return `starWarsCategory${index}`;
});

describe("@graphql-markdown/docusaurus", () => {
  test("beforeGenerateIndexMetafileHook", async ({ bench }) => {
    files.clear();
    await beforeGenerateIndexMetafileHook({
      data: {
        dirPath: `/output/types/${categories[0]}`,
        category: categories[0],
        outputAdapter: memoryOutputAdapter,
        options: { index: true, collapsible: true, collapsed: false },
      },
    });
    expect(files.size).toBeGreaterThan(0);

    await bench("write _category_.yml for 50 categories", async () => {
      files.clear();
      for (const category of categories) {
        await beforeGenerateIndexMetafileHook({
          data: {
            dirPath: `/output/types/${category}`,
            category,
            outputAdapter: memoryOutputAdapter,
            options: { index: true, collapsible: true, collapsed: false },
          },
        });
      }
    }).run();
  });
});
