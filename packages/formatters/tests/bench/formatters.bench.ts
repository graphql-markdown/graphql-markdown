import { describe, expect, test } from "vitest";

import type { Formatter, MetaInfo } from "@graphql-markdown/types";

import * as presets from "../../src";
import { createInternalLinksRewriter } from "../../src/output";

const ENTITY_COUNT = 50;

const entities = Array.from({ length: ENTITY_COUNT }, (_, index) => {
  return {
    name: `field${index}`,
    parent: `Entity${index % 5}`,
    url: `/graphql/types/objects/entity-${index}`,
  };
});

const frontMatterProps = {
  id: "entity",
  title: "Entity",
  sidebar_class_name: "graphql-object",
};
const formattedFrontMatter = ["slug: /types/objects/entity", "tags: [graphql]"];

const meta = { generatorFrameworkName: "bench" } as unknown as MetaInfo;

// Calls every formatter method about as often as the printer does for a type
// page with ENTITY_COUNT fields.
const formatPage = (formatter: Formatter): void => {
  formatter.formatMDXFrontmatter(frontMatterProps, formattedFrontMatter);
  formatter.formatMDXAdmonition(
    { text: "This type is deprecated.", title: "Deprecated", type: "warning" },
    meta,
  );
  formatter.formatMDXDetails({ dataOpen: "Hide", dataClose: "Show" });
  formatter.formatMDXSpecifiedByLink("https://spec.graphql.org/");
  for (const { name, parent, url } of entities) {
    formatter.formatMDXNameEntity(name, parent);
    formatter.formatMDXLink({ text: parent, url });
    formatter.formatMDXBadge({ text: "non-null", classname: "badge" });
    formatter.formatMDXBullet(name);
    formatter.formatMDXPermalink(name);
  }
};

const formatters: [string, Formatter][] = Object.entries(presets).map(
  ([name, preset]) => {
    return [name, preset.createMDXFormatter(meta)];
  },
);

const PAGE = Array.from({ length: 200 }, (_, index) => {
  const folder = index % 2 === 0 ? "types/objects" : "operations/queries";
  return `- [Entity${index}](/graphql/${folder}/entity-${index}#field) and [external](https://example.com/${index})`;
}).join("\n");

const rewriteInternalLinks = createInternalLinksRewriter(".md");

describe("@graphql-markdown/formatters", () => {
  test("format a type page with every preset", async ({ bench }) => {
    expect(formatters.length).toBeGreaterThan(0);

    await bench.compare(
      ...formatters.map(([name, formatter]) => {
        return bench(`format page (${name})`, () => {
          formatPage(formatter);
        });
      }),
    );
  });

  test("output", async ({ bench }) => {
    expect(
      rewriteInternalLinks(
        PAGE,
        "/output/types/objects/film.md",
        "/output",
        "graphql",
      ),
    ).toContain("https://example.com/");

    await bench("rewrite internal links (200 links)", () => {
      rewriteInternalLinks(
        PAGE,
        "/output/types/objects/film.md",
        "/output",
        "graphql",
      );
    }).run();
  });
});
