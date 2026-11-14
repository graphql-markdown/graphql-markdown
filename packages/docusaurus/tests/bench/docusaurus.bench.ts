import { describe, expect, test } from "vitest";

import type { OutputAdapter } from "@graphql-markdown/types";

import {
  beforeGenerateIndexMetafileHook,
  createMDXFormatter,
} from "../../src/mdx";

const CATEGORY_COUNT = 50;

// Keeps metafiles in memory so the benchmark measures the hook rather than
// disk I/O.
const files = new Map<string, string>();
const memoryOutputAdapter: OutputAdapter = {
  writeFile: async (filePath: string, content: string): Promise<void> => {
    files.set(filePath, content);
  },
  ensureDir: async (): Promise<void> => {},
  readFile: async (filePath: string): Promise<string | undefined> => {
    return files.get(filePath);
  },
};

const categories = Array.from({ length: CATEGORY_COUNT }, (_, index) => {
  return `starWarsCategory${index}`;
});

const formatter = createMDXFormatter();

const entities = Array.from({ length: CATEGORY_COUNT }, (_, index) => {
  return {
    name: `field${index}`,
    parent: `Entity${index % 5}`,
    url: `/graphql/types/objects/entity-${index}`,
  };
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

  test("MDX formatter", async ({ bench }) => {
    expect(formatter.formatMDXBullet("field0")).toBeTruthy();

    await bench("format type page entities (50 fields)", () => {
      formatter.formatMDXFrontmatter({ id: "entity", title: "Entity" }, [
        "slug: /types/objects/entity",
      ]);
      for (const { name, parent, url } of entities) {
        formatter.formatMDXNameEntity(name, parent);
        formatter.formatMDXLink({ text: parent, url });
        formatter.formatMDXBadge({ text: "non-null", classname: "badge" });
        formatter.formatMDXBullet(name);
      }
    }).run();
  });
});
