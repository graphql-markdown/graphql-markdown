import { createSectionIndexHook } from "../../../src/output";
import {
  beforeGenerateIndexMetafileHook,
  createMDXFormatter,
  formatMDXAdmonition,
  formatMDXFrontmatter,
  formatMDXLink,
  mdxExtension,
} from "../../../src/zola";

describe("formatMDXFrontmatter", () => {
  test("returns empty string for empty input", () => {
    expect(formatMDXFrontmatter(undefined, null)).toBe("");
    expect(formatMDXFrontmatter(undefined, [])).toBe("");
  });

  test("keeps Zola keys on top and moves others under extra", () => {
    const result = formatMDXFrontmatter(undefined, [
      "title: Test",
      "id: test-id",
      "weight: 2",
      "sidebar_label: Foo",
    ]);
    expect(result).toBe(
      [
        "---",
        "title: Test",
        "weight: 2",
        "extra:",
        "  id: test-id",
        "  sidebar_label: Foo",
        "---",
        "",
        "# Test",
      ].join("\n"),
    );
  });

  test("omits extra when all keys are Zola keys", () => {
    const result = formatMDXFrontmatter(undefined, ["title: T"]);
    expect(result).not.toContain("extra:");
  });

  test("renders heading after front matter", () => {
    expect(formatMDXFrontmatter(undefined, ["title: 'My Title'"])).toContain(
      "\n\n# My Title",
    );
  });

  test("keeps indented continuation lines with their key", () => {
    const result = formatMDXFrontmatter(undefined, [
      "title: T",
      "tags:",
      "  - a",
    ]);
    expect(result).toContain("extra:\n  tags:\n    - a");
  });

  test("falls back to props", () => {
    const result = formatMDXFrontmatter({ title: "P", id: "x" }, null);
    expect(result).toContain("title:");
    expect(result).toContain("extra:");
  });

  test("no heading without a title", () => {
    expect(formatMDXFrontmatter(undefined, ["id: x"])).not.toContain("#");
  });
});

describe("formatMDXLink", () => {
  test.each([
    ["/api/types/foo", "@/api/types/foo.md"],
    ["/api/types/foo.md", "@/api/types/foo.md"],
    ["/api/types/foo#bar", "@/api/types/foo.md#bar"],
    ["/api/types/foo.md#bar", "@/api/types/foo.md#bar"],
    ["@/api/foo.md", "@/api/foo.md"],
    ["https://example.com/a", "https://example.com/a"],
    ["//cdn.example.com/a", "//cdn.example.com/a"],
    ["#anchor", "#anchor"],
    ["mailto:a@b.c", "mailto:a@b.c"],
  ])("%s -> %s", (url, expected) => {
    expect(formatMDXLink({ text: "t", url })).toEqual({
      text: "t",
      url: expected,
    });
  });
});

describe("formatMDXAdmonition", () => {
  test("renders blockquote with bold title", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "My Title", type: "note" },
      null,
    );
    expect(result).toContain("> **My Title**\n> body");
    expect(result).not.toContain("[!");
  });

  test("renders without title", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "", type: "warning" },
      null,
    );
    expect(result).toContain("> body");
    expect(result).not.toContain("**");
  });
});

describe("beforeGenerateIndexMetafileHook", () => {
  test("writes _index.md through the output adapter", async () => {
    const outputAdapter = {
      writeFile: vi.fn(),
      readFile: vi.fn(),
      mkdir: vi.fn(),
    };
    await beforeGenerateIndexMetafileHook({
      data: { dirPath: "/out/api", category: "my-types", outputAdapter },
    } as never);

    expect(outputAdapter.writeFile).toHaveBeenCalledTimes(1);
    const [path, content] = outputAdapter.writeFile.mock.calls[0];
    expect(path).toBe("/out/api/_index.md");
    expect(content).toBe(
      '---\ntitle: "My Types"\nsort_by: "title"\n---\n\n# My Types\n\n',
    );
    expect(content).not.toContain("bookCollapseSection");
  });
});

describe("createSectionIndexHook", () => {
  test("writes the file name given with the front matter lines given", async () => {
    const outputAdapter = {
      writeFile: vi.fn(),
      readFile: vi.fn(),
      mkdir: vi.fn(),
    };
    const hook = createSectionIndexHook("_index.md", (label) => {
      return [`alias: "${label}"`];
    });
    await hook({
      data: { dirPath: "/out/api", category: "my-types", outputAdapter },
    } as never);

    expect(outputAdapter.writeFile).toHaveBeenCalledTimes(1);
    const [path, content] = outputAdapter.writeFile.mock.calls[0];
    expect(path).toBe("/out/api/_index.md");
    expect(content).toBe(
      '---\ntitle: "My Types"\nalias: "My Types"\n---\n\n# My Types\n\n',
    );
  });
});

describe("createMDXFormatter", () => {
  test("returns all formatter functions", () => {
    const formatter = createMDXFormatter();
    for (const name of [
      "formatMDXBadge",
      "formatMDXAdmonition",
      "formatMDXBullet",
      "formatMDXDetails",
      "formatMDXFrontmatter",
      "formatMDXLink",
      "formatMDXNameEntity",
      "formatMDXPermalink",
      "formatMDXSpecifiedByLink",
    ]) {
      expect(formatter).toHaveProperty(name);
    }
  });

  test("mdxExtension is .md", () => {
    expect(mdxExtension).toBe(".md");
  });
});
