import type { AdmonitionType, Badge, TypeLink } from "@graphql-markdown/types";

import { createDefaultFormatter } from "../../src/formatter";

describe("formatter", () => {
  describe("createDefaultFormatter", () => {
    const formatter = createDefaultFormatter();

    describe("formatMDXBadge", () => {
      it("formats a badge with text", () => {
        const badge: Badge = { text: "Required" };
        const result = formatter.formatMDXBadge(badge);
        expect(result).toBe('<mark class="gqlmd-mdx-badge">Required</mark>');
      });

      it("formats a badge with classname", () => {
        const badge: Badge = { text: "Deprecated", classname: "deprecated" };
        const result = formatter.formatMDXBadge(badge);
        expect(result).toBe('<mark class="gqlmd-mdx-badge">Deprecated</mark>');
      });
    });

    describe("formatMDXAdmonition", () => {
      it("formats an admonition with type and title", () => {
        const admonition: AdmonitionType = {
          text: "This is important",
          title: "Note",
          type: "info",
        };
        const result = formatter.formatMDXAdmonition(admonition, undefined);
        expect(result).toContain("gqlmd-mdx-admonition-fieldset");
        expect(result).toContain("gqlmd-mdx-admonition-legend-type-info");
        expect(result).toContain("INFO Note");
        expect(result).toContain("This is important");
      });

      it("formats an admonition with custom icon", () => {
        const admonition: AdmonitionType = {
          text: "Warning message",
          title: "Warning",
          type: "warning",
          icon: "⚠️",
        };
        const result = formatter.formatMDXAdmonition(admonition, undefined);
        expect(result).toContain("⚠️ Warning");
        expect(result).toContain("gqlmd-mdx-admonition-legend-type-warning");
      });
    });

    describe("formatMDXBullet", () => {
      it("formats a bullet without text", () => {
        const result = formatter.formatMDXBullet();
        expect(result).toBe(
          '<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>',
        );
      });

      it("formats a bullet with text", () => {
        const result = formatter.formatMDXBullet("item");
        expect(result).toBe(
          '<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>item',
        );
      });
    });

    describe("formatMDXDetails", () => {
      it("formats a details element", () => {
        const result = formatter.formatMDXDetails({ dataOpen: "show" });
        expect(result).toContain("gqlmd-mdx-details");
        expect(result).toContain("gqlmd-mdx-details-summary");
        expect(result).toContain("SHOW");
      });
    });

    describe("formatMDXFrontmatter", () => {
      it("returns empty string when formatted is undefined", () => {
        const result = formatter.formatMDXFrontmatter(undefined, undefined);
        expect(result).toBe("");
      });

      it("returns empty string when formatted is null", () => {
        const result = formatter.formatMDXFrontmatter(undefined, null);
        expect(result).toBe("");
      });

      it("formats frontmatter with content", () => {
        const result = formatter.formatMDXFrontmatter(undefined, [
          "title: Test",
          "id: test-id",
        ]);
        expect(result).toContain("---");
        expect(result).toContain("title: Test");
        expect(result).toContain("id: test-id");
      });
    });

    describe("formatMDXLink", () => {
      it("returns the link unchanged", () => {
        const link: TypeLink = { text: "MyType", url: "/types/mytype" };
        const result = formatter.formatMDXLink(link);
        expect(result).toEqual(link);
      });
    });

    describe("formatMDXNameEntity", () => {
      it("formats a name entity without parent type", () => {
        const result = formatter.formatMDXNameEntity("fieldName");
        expect(result).toBe(
          '<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">fieldName</code></span>',
        );
      });

      it("formats a name entity with parent type", () => {
        const result = formatter.formatMDXNameEntity("fieldName", "ParentType");
        expect(result).toBe(
          '<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">ParentType</code>.<code class="gqlmd-mdx-entity-name">fieldName</code></span>',
        );
      });

      it("formats a name entity with undefined parent type", () => {
        const result = formatter.formatMDXNameEntity("fieldName", undefined);
        expect(result).toBe(
          '<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">fieldName</code></span>',
        );
      });
    });

    describe("formatMDXSpecifiedByLink", () => {
      it("formats a specified by link", () => {
        const result = formatter.formatMDXSpecifiedByLink(
          "https://example.com/spec",
        );
        expect(result).toContain("gqlmd-mdx-specifiedby");
        expect(result).toContain("gqlmd-mdx-specifiedby-link");
        expect(result).toContain('href="https://example.com/spec"');
        expect(result).toContain(
          'title="Specified by https://example.com/spec"',
        );
        expect(result).toContain("Specification");
      });
    });
  });
});
