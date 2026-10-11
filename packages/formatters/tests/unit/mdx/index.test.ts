import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  afterRenderTypeEntitiesHook,
  createMDXFormatter,
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXPermalink,
  formatMDXSpecifiedByLink,
  mdxExtension,
} from "../../../src/mdx";

describe("formatMDXBadge", () => {
  test("renders a plain HTML mark element", () => {
    expect(formatMDXBadge({ text: "Required" })).toBe(
      '<mark class="gqlmd-mdx-badge">Required</mark>',
    );
  });
});

describe("formatMDXAdmonition", () => {
  test("renders a blockquote with the title as bold label", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "My Title", type: "note" },
      null,
    );
    expect(result).toContain("> **My Title**");
    expect(result).toContain("> body");
  });

  test("ends with a blank line so following text is not absorbed", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "T", type: "note" },
      null,
    );
    expect(result.endsWith("> body\n\n")).toBe(true);
  });

  test("falls back to the uppercase type when title is blank", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "  ", type: "warning" },
      null,
    );
    expect(result).toContain("> **WARNING**");
  });
});

describe("formatMDXDetails", () => {
  test("renders a details element split by \\r", () => {
    const result = formatMDXDetails({ dataOpen: "Open", dataClose: "Close" });
    const parts = result.split("\r");
    expect(parts).toHaveLength(2);
    expect(parts[0]).toContain("<details>");
    expect(parts[0]).toContain("<summary>Open</summary>");
    expect(parts[1]).toContain("<em>Close</em>");
    expect(parts[1]).toContain("</details>");
  });
});

describe("formatMDXFrontmatter", () => {
  test("keeps YAML front matter", () => {
    expect(formatMDXFrontmatter(undefined, ["id: test", "title: Test"])).toBe(
      "---\nid: test\ntitle: Test\n---",
    );
  });

  test("returns empty string without lines", () => {
    expect(formatMDXFrontmatter(undefined, undefined)).toBe("");
  });
});

describe("formatMDXPermalink", () => {
  test("escapes braces so the permalink is valid MDX", () => {
    expect(formatMDXPermalink("foo")).toBe(String.raw`\{#foo\}`);
  });
});

describe("formatMDXLink", () => {
  test("appends .mdx to extensionless absolute paths", () => {
    expect(formatMDXLink({ text: "Type", url: "/schema/type" })).toEqual({
      text: "Type",
      url: "/schema/type.mdx",
    });
  });

  test("leaves links with an extension unchanged", () => {
    const link = { text: "Type", url: "/schema/type.mdx" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("returns link unchanged when URL is null", () => {
    const link = { text: "Type", url: null };
    expect(formatMDXLink(link)).toEqual(link);
  });
});

describe("shared helpers", () => {
  test("formatMDXBullet", () => {
    expect(formatMDXBullet("item")).toContain("item");
  });

  test("formatMDXNameEntity", () => {
    expect(formatMDXNameEntity("field", "Query")).toContain("field");
  });

  test("formatMDXSpecifiedByLink", () => {
    expect(formatMDXSpecifiedByLink("https://spec.example")).toContain(
      'href="https://spec.example"',
    );
  });
});

describe("createMDXFormatter", () => {
  test("returns a complete formatter without mdxDeclaration", () => {
    const formatter = createMDXFormatter();
    expect(formatter).toHaveProperty("formatMDXBadge");
    expect(formatter).toHaveProperty("formatMDXAdmonition");
    expect(formatter).toHaveProperty("formatMDXFrontmatter");
    expect(formatter).toHaveProperty("formatMDXLink");
    expect(formatter).not.toHaveProperty("mdxDeclaration");
  });
});

describe("mdxExtension", () => {
  test("is .mdx", () => {
    expect(mdxExtension).toBe(".mdx");
  });
});

describe("afterRenderTypeEntitiesHook", () => {
  test("rewrites absolute internal links to relative .mdx paths", async () => {
    const rootDir = mkdtempSync(join(tmpdir(), "mdx-hook-"));
    const outputDir = join(rootDir, "graphql");
    const filePath = join(outputDir, "types", "objects", "country.mdx");
    mkdirSync(join(outputDir, "types", "objects"), { recursive: true });
    writeFileSync(
      filePath,
      "# Country\n\n[ID!](/graphql/types/scalars/id.mdx#field) scalar\n",
      "utf-8",
    );

    await afterRenderTypeEntitiesHook({
      data: { baseURL: "graphql", filePath, outputDir },
    });

    const result = readFileSync(filePath, "utf-8");
    expect(result).not.toContain("](/graphql/");
    expect(result).toContain("](../scalars/id.mdx#field)");
  });
});
