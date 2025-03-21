import {
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
} from "../../../src/mdx";

describe("formatMDXBadge", () => {
  test("returns a formatted MDX badge string", () => {
    const badge = { text: "Test Badge", classname: "test-class" };
    const result = formatMDXBadge(badge);
    expect(result).toBe(
      '<Badge class="badge badge--secondary badge--test-class" text="Test Badge"/>',
    );
  });
});

describe("formatMDXAdmonition", () => {
  test("returns a formatted MDX admonition string for Docusaurus v2", () => {
    const admonition = {
      text: "Test Text",
      title: "Test Title",
      type: "warning",
    };
    const meta = {
      generatorFrameworkName: "docusaurus",
      generatorFrameworkVersion: "2.0.0",
    };
    const result = formatMDXAdmonition(admonition, meta);
    expect(result).toBe("\n\n:::caution Test TitleTest Text:::");
  });

  test("returns a formatted MDX admonition string for non-Docusaurus", () => {
    const admonition = { text: "Test Text", title: "Test Title", type: "info" };
    const meta = null;
    const result = formatMDXAdmonition(admonition, meta);
    expect(result).toBe("\n\n:::info[Test Title]Test Text:::");
  });
});

describe("formatMDXBullet", () => {
  test("returns a formatted MDX bullet string", () => {
    const result = formatMDXBullet("Test Bullet");
    expect(result).toBe("<Bullet />Test Bullet");
  });
});

describe("formatMDXDetails", () => {
  test("returns a formatted MDX details string", () => {
    const details = { dataOpen: "Open", dataClose: "Close" };
    const result = formatMDXDetails(details);
    expect(result).toBe(
      '\n\n<Details dataOpen="Hide Open" dataClose="Show Close">\n\n\r\n\n</Details>\n\n',
    );
  });
});

describe("formatMDXSpecifiedByLink", () => {
  test("returns a formatted MDX specified by link string", () => {
    const url = "https://example.com";
    const result = formatMDXSpecifiedByLink(url);
    expect(result).toBe('<SpecifiedBy url="https://example.com"/>');
  });
});

describe("formatMDXNameEntity", () => {
  test("returns a formatted MDX name entity string with parent type", () => {
    const result = formatMDXNameEntity("EntityName", "ParentType");
    expect(result).toBe(
      "<code style={{ fontWeight: 'normal' }}>ParentType.<b>EntityName</b></code>",
    );
  });

  test("returns a formatted MDX name entity string without parent type", () => {
    const result = formatMDXNameEntity("EntityName");
    expect(result).toBe(
      "<code style={{ fontWeight: 'normal' }}><b>EntityName</b></code>",
    );
  });
});

describe("formatMDXLink", () => {
  test("returns a formatted MDX link object", () => {
    const link = { text: "Link Text", url: "/example" };
    const result = formatMDXLink(link);
    expect(result).toEqual({ text: "Link Text", url: "/example.mdx" });
  });
});
