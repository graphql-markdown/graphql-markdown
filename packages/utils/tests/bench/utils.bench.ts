import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, test } from "vitest";

import {
  convertArrayToMapObject,
  escapeMDX,
  formatFrontMatterObject,
  kebabCase,
  replaceDiacritics,
  startCase,
  toRelativeGeneratedDocLink,
} from "../../src";

const SCHEMA_SDL = readFileSync(
  join(__dirname, "../../../core/tests/__data__/swapi.graphql"),
  "utf-8",
);

// Every identifier of the swapi schema (type, field and argument names), the
// strings the printer turns into slugs, titles and anchors.
const identifiers: string[] = [
  ...new Set(SCHEMA_SDL.match(/[A-Za-z_]\w*/g) ?? []),
];

// Non-empty schema lines, standing in for the descriptions `escapeMDX` gets.
const lines: string[] = SCHEMA_SDL.split("\n")
  .map((line) => {
    return line.trim();
  })
  .filter((line) => {
    return line.length > 0;
  });

const namedEntries = identifiers.map((name, index) => {
  return { name, index };
});

const frontMatter = {
  id: "film",
  title: "Film",
  slug: "/types/objects/film",
  sidebar_class_name: "graphql-object",
  hide_table_of_contents: false,
  tags: ["graphql", "object", "swapi"],
  custom: {
    graphql: { kind: "object", deprecated: false },
    links: [{ label: "Query", href: "/types/query" }],
  },
};

const docLinks: string[] = identifiers.slice(0, 200).map((name, index) => {
  const folder = index % 2 === 0 ? "types/objects" : "operations/queries";
  return `/graphql/${folder}/${kebabCase(name)}`;
});

describe("@graphql-markdown/utils", () => {
  test("string case", async ({ bench }) => {
    await bench.compare(
      bench("kebabCase for every identifier (swapi)", () => {
        for (const name of identifiers) {
          kebabCase(name);
        }
      }),
      bench("startCase for every identifier (swapi)", () => {
        for (const name of identifiers) {
          startCase(name);
        }
      }),
      bench("replaceDiacritics for every identifier (swapi)", () => {
        for (const name of identifiers) {
          replaceDiacritics(name);
        }
      }),
    );
  });

  test("markdown", async ({ bench }) => {
    await bench.compare(
      bench("escapeMDX for every schema line (swapi)", () => {
        for (const line of lines) {
          escapeMDX(line);
        }
      }),
      bench("formatFrontMatterObject (nested)", () => {
        formatFrontMatterObject(frontMatter);
      }),
      bench("convertArrayToMapObject (swapi identifiers)", () => {
        convertArrayToMapObject(namedEntries);
      }),
    );
  });

  test("links", async ({ bench }) => {
    await bench("toRelativeGeneratedDocLink for 200 links", () => {
      for (const targetUrlPath of docLinks) {
        toRelativeGeneratedDocLink({
          baseURL: "graphql",
          currentFilePath: "/output/types/objects/film.md",
          outputDir: "/output",
          targetUrlPath,
        });
      }
    }).run();
  });
});
