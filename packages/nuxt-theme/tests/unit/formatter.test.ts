import { describe, it, expect } from "vitest";
import { formatMDXFrontmatter } from "../../formatter";

describe("formatMDXFrontmatter", () => {
  it("wraps pre-formatted lines in --- delimiters, matching the default shape", () => {
    const result = formatMDXFrontmatter(undefined, ["id: user", "title: User"]);

    expect(result).toBe("---\nid: user\ntitle: User\n---");
  });

  it("appends a kind line when context.entity is provided", () => {
    const result = formatMDXFrontmatter(undefined, ["id: user", "title: User"], {
      entity: "objects",
    });

    expect(result).toBe("---\nid: user\ntitle: User\nkind: objects\n---");
  });

  it("omits the kind line when context is not provided", () => {
    const result = formatMDXFrontmatter(undefined, ["id: user", "title: User"]);

    expect(result).not.toContain("kind:");
  });

  it("omits the kind line when context.entity is null or undefined", () => {
    expect(formatMDXFrontmatter(undefined, ["title: User"], {})).not.toContain("kind:");
    expect(
      formatMDXFrontmatter(undefined, ["title: User"], { entity: null }),
    ).not.toContain("kind:");
  });

  it("returns an empty string when formatted is null or undefined", () => {
    expect(formatMDXFrontmatter(undefined, null)).toBe("");
    expect(formatMDXFrontmatter(undefined, undefined)).toBe("");
  });
});
