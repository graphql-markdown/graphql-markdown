import { describe, it, expect } from "vitest";
import {
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXFrontmatter,
  formatMDXNameEntity,
  mdxExtension,
} from "../../formatter.mjs";

describe("formatMDXFrontmatter", () => {
  it("wraps pre-formatted lines in --- delimiters, matching the default shape", () => {
    const result = formatMDXFrontmatter(undefined, ["id: user", "title: User"]);

    expect(result).toBe("---\nid: user\ntitle: User\n---");
  });

  it("appends a kind line when context.entity is provided", () => {
    const result = formatMDXFrontmatter(
      undefined,
      ["id: user", "title: User"],
      {
        entity: "objects",
      },
    );

    expect(result).toBe("---\nid: user\ntitle: User\nkind: objects\n---");
  });

  it("omits the kind line when context is not provided", () => {
    const result = formatMDXFrontmatter(undefined, ["id: user", "title: User"]);

    expect(result).not.toContain("kind:");
  });

  it("omits the kind line when context.entity is null or undefined", () => {
    expect(formatMDXFrontmatter(undefined, ["title: User"], {})).not.toContain(
      "kind:",
    );
    expect(
      formatMDXFrontmatter(undefined, ["title: User"], { entity: null }),
    ).not.toContain("kind:");
  });

  it("returns an empty string when formatted is null or undefined", () => {
    expect(formatMDXFrontmatter(undefined, null)).toBe("");
    expect(formatMDXFrontmatter(undefined, undefined)).toBe("");
  });
});

describe("formatMDXBullet", () => {
  it("prefixes the text with a middle dot", () => {
    expect(formatMDXBullet("ID!")).toBe("&nbsp;·&nbsp;ID!");
  });

  it("defaults to an empty text", () => {
    expect(formatMDXBullet()).toBe("&nbsp;·&nbsp;");
  });
});

describe("formatMDXBadge", () => {
  it("adds a lowercase modifier class derived from the text", () => {
    expect(formatMDXBadge({ text: "NON-NULL" })).toBe(
      '<mark class="gqlmd-mdx-badge gqlmd-mdx-badge-non-null">NON-NULL</mark>',
    );
  });
});

describe("formatMDXNameEntity", () => {
  it("writes list brackets as character references so MDC keeps them", () => {
    expect(formatMDXNameEntity("[Project!]!")).toBe(
      '<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">&#x005B;Project!&#x005D;!</code></span>',
    );
  });

  it("prefixes the parent type when one is given", () => {
    expect(formatMDXNameEntity("nodes", "ProjectConnection")).toBe(
      '<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">ProjectConnection</code>.<code class="gqlmd-mdx-entity-name">nodes</code></span>',
    );
  });
});

describe("formatMDXAdmonition", () => {
  it("renders a deprecation callout for a deprecated warning", () => {
    expect(
      formatMDXAdmonition({
        text: "  Use `newField` instead. ",
        title: "Deprecated",
        type: "WARNING",
      }),
    ).toBe("::api-deprecation\nUse `newField` instead.\n::");
  });

  it("renders a typed fieldset for any other admonition", () => {
    expect(
      formatMDXAdmonition({ text: "Heads up", title: "Note", type: "INFO" }),
    ).toBe(
      '<fieldset class="gqlmd-mdx-admonition-fieldset"><legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-info">Note</span></legend><span>Heads up</span></fieldset>',
    );
  });

  it("renders a fieldset for a warning that is not a deprecation", () => {
    expect(
      formatMDXAdmonition({ text: "Careful", title: null, type: "warning" }),
    ).toContain("gqlmd-mdx-admonition-legend-type-warning");
  });
});

describe("mdxExtension", () => {
  it("emits plain Markdown so Nuxt Content indexes it for search", () => {
    expect(mdxExtension).toBe(".md");
  });
});
