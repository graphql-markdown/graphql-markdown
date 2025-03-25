import MDX, { mdxModule } from "../../../src/mdx";

jest.mock("custom-mdx");

describe("mdx", () => {
  describe("formatMDXBadge", () => {
    test("returns a formatted badge using standard markdown", () => {
      expect(MDX.formatMDXBadge({ text: "Test badge", classname: "" })).toBe(
        `<mark class="gqlmd-mdx-badge">Test badge</mark>`,
      );
    });
  });

  describe("formatMDXAdmonition", () => {
    test("returns a formatted admonition using standard markdown", () => {
      expect(
        MDX.formatMDXAdmonition(
          {
            text: "Test admonition",
            title: "Warning",
            type: "warning",
            icon: undefined,
          },
          undefined,
        ),
      ).toMatchInlineSnapshot(`
"

<fieldset class="gqlmd-mdx-admonition-fieldset">
<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning">WARNING Warning</span></legend>
<span>Test admonition</span>
</fieldset>"
`);
    });
  });

  describe("formatMDXDetails", () => {
    test("returns a formatted details section using standard markdown", () => {
      expect(MDX.formatMDXDetails({ dataOpen: "This is a summary" })).
toMatchInlineSnapshot(`
"

<details class="gqlmd-mdx-details">
<summary class="gqlmd-mdx-details-summary"><span className="gqlmd-mdx-details-summary-open">THIS IS A SUMMARY</span></summary>
</details>

"
`);
    });
  });

  describe("formatMDXNameEntity", () => {
    test("returns a formatted named entity", () => {
      expect(MDX.formatMDXNameEntity("Test Entity")).toBe(
        '<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Test Entity</code></span>',
      );
    });

    test("returns a formatted named entity with parent prefix", () => {
      expect(MDX.formatMDXNameEntity("Entity", "Parent")).toBe(
        '<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">Parent</code>.<code class="gqlmd-mdx-entity-name">Entity</code></span>',
      );
    });
  });

  describe("mdxModule", () => {
    test("returns default markdown formatters", async () => {
      await expect(mdxModule()).resolves.toBe(MDX);
    });

    test("returns custom markdown formatters if module defined", async () => {
      await expect(mdxModule({})).resolves.not.toBe(MDX);
    });
  });
});
