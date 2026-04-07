import type { CollapsibleOption } from "@graphql-markdown/types";

import {
  formatMDXBadge,
  formatMDXAdmonition,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
} from "../../src/format-helpers";

describe("format-helpers", () => {
  describe("formatMDXBadge()", () => {
    it("formats a badge with text", () => {
      expect(formatMDXBadge({ text: "Required" })).toBe(
        '<mark class="gqlmd-mdx-badge">Required</mark>',
      );
    });
  });

  describe("formatMDXAdmonition()", () => {
    it("formats an admonition with type, title, and text", () => {
      const result = formatMDXAdmonition(
        { text: "Body", title: "Note", type: "info" },
        undefined,
      );
      expect(result).toContain("gqlmd-mdx-admonition-fieldset");
      expect(result).toContain("gqlmd-mdx-admonition-legend-type-info");
      expect(result).toContain("INFO Note");
      expect(result).toContain("Body");
    });

    it("uses custom icon when provided", () => {
      const result = formatMDXAdmonition(
        { text: "Body", title: "Warn", type: "warning", icon: "⚠️" },
        undefined,
      );
      expect(result).toContain("⚠️ Warn");
    });
  });

  describe("formatMDXBullet()", () => {
    it("formats a bullet without text", () => {
      expect(formatMDXBullet()).toBe(
        '<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>',
      );
    });

    it("formats a bullet with text", () => {
      expect(formatMDXBullet("item")).toBe(
        '<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>item',
      );
    });
  });

  describe("formatMDXDetails()", () => {
    it("returns a details element with the open label uppercased", () => {
      const result = formatMDXDetails({
        dataOpen: "deprecated",
      } as CollapsibleOption);
      expect(result).toContain("gqlmd-mdx-details");
      expect(result).toContain("gqlmd-mdx-details-summary");
      expect(result).toContain("DEPRECATED");
    });

    it("includes a \\r delimiter between open and close parts for use with split('\\r')", () => {
      const result = formatMDXDetails({
        dataOpen: "deprecated",
      } as CollapsibleOption);
      const parts = result.split("\r");
      expect(parts).toHaveLength(2);
      expect(parts[0]).toContain("</summary>");
      expect(parts[1]).toContain("</details>");
    });
  });

  describe("formatMDXFrontmatter()", () => {
    it("returns empty string when formatted is null", () => {
      expect(formatMDXFrontmatter(undefined, null)).toBe("");
    });

    it("returns empty string when formatted is undefined", () => {
      expect(formatMDXFrontmatter(undefined, undefined)).toBe("");
    });

    it("formats frontmatter lines between delimiters", () => {
      const result = formatMDXFrontmatter(undefined, ["title: Test"]);
      expect(result).toContain("---");
      expect(result).toContain("title: Test");
    });
  });

  describe("formatMDXLink()", () => {
    it("returns the link unchanged", () => {
      const link = { text: "MyType", url: "/types/mytype" };
      expect(formatMDXLink(link)).toEqual(link);
    });
  });

  describe("formatMDXNameEntity()", () => {
    it("formats a name entity without parent type", () => {
      expect(formatMDXNameEntity("fieldName")).toBe(
        '<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">fieldName</code></span>',
      );
    });

    it("formats a name entity with parent type", () => {
      expect(formatMDXNameEntity("fieldName", "ParentType")).toBe(
        '<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">ParentType</code>.<code class="gqlmd-mdx-entity-name">fieldName</code></span>',
      );
    });
  });

  describe("formatMDXSpecifiedByLink()", () => {
    it("formats a specified-by link", () => {
      const result = formatMDXSpecifiedByLink("https://example.com/spec");
      expect(result).toContain("gqlmd-mdx-specifiedby");
      expect(result).toContain('href="https://example.com/spec"');
    });
  });
});
