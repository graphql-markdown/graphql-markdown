import * as docfx from "../../src/docfx";
import * as docusaurus from "../../src/docusaurus";
import * as fumadocs from "../../src/fumadocs";
import * as honkit from "../../src/honkit";
import * as hugo from "../../src/hugo";
import * as mdbook from "../../src/mdbook";
import * as mdx from "../../src/mdx";
import * as mkdocs from "../../src/mkdocs";
import * as starlight from "../../src/starlight";
import * as vocs from "../../src/vocs";

const presets = {
  docfx,
  docusaurus,
  fumadocs,
  honkit,
  hugo,
  mdbook,
  mdx,
  mkdocs,
  starlight,
  vocs,
};

const meta = {
  generatorFrameworkName: "docusaurus",
  generatorFrameworkVersion: "3.10.0",
};

describe("spread presets", () => {
  describe.each(Object.entries(presets))("%s", (_name, preset) => {
    test("custom function overrides the preset one when spread", () => {
      const custom = (): never => {
        return "custom" as never;
      };
      const spread = { ...preset, formatMDXBadge: custom };

      expect(spread.formatMDXBadge({ text: "a" })).toBe("custom");
    });

    test("spread formatMDXAdmonition matches the factory one", () => {
      const admonition = { type: "warning", title: "DEPRECATED", text: "x" };
      const spread = { ...preset };

      expect(spread.formatMDXAdmonition(admonition, meta)).toBe(
        preset.createMDXFormatter(meta).formatMDXAdmonition(admonition, meta),
      );
    });
  });

  test("docusaurus spread permalink with meta matches the factory one", () => {
    const spread = { ...docusaurus };

    expect(spread.formatMDXPermalink("my-id", meta)).toBe(
      docusaurus.createMDXFormatter(meta).formatMDXPermalink("my-id"),
    );
  });
});
