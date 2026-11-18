import { escapeHTMLAttribute, escapeMarkdownURL } from "../../src/escape.ts";

describe("escapeHTMLAttribute", () => {
  test.each([
    ["&", "&amp;"],
    ['"', "&quot;"],
    ["'", "&#39;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ["{", "&#123;"],
    ["}", "&#125;"],
  ])("encodes %s as a character reference", (char, expected) => {
    expect(escapeHTMLAttribute(char)).toBe(expected);
  });

  test("encodes ampersand first so other references are not double-encoded", () => {
    expect(escapeHTMLAttribute('&"<')).toBe("&amp;&quot;&lt;");
    expect(escapeHTMLAttribute("&quot;")).toBe("&amp;quot;");
  });

  test("leaves a plain https URL unchanged", () => {
    expect(escapeHTMLAttribute("https://spec.example/path?a=1&b=2#x")).toBe(
      "https://spec.example/path?a=1&amp;b=2#x",
    );
    expect(escapeHTMLAttribute("https://spec.example")).toBe(
      "https://spec.example",
    );
  });
});

describe("escapeMarkdownURL", () => {
  test.each([
    [" ", "%20"],
    ["\t", "%09"],
    ["\n", "%0A"],
    ['"', "%22"],
    ["'", "%27"],
    ["(", "%28"],
    [")", "%29"],
    ["<", "%3C"],
    [">", "%3E"],
    ["\\", "%5C"],
    ["`", "%60"],
    ["[", "%5B"],
    ["]", "%5D"],
    ["{", "%7B"],
    ["}", "%7D"],
    ["|", "%7C"],
    ["^", "%5E"],
  ])("percent-encodes %j as %s", (char, expected) => {
    expect(escapeMarkdownURL(char)).toBe(expected);
  });

  test("percent-encodes non-ASCII whitespace as UTF-8", () => {
    expect(escapeMarkdownURL(" ")).toBe("%C2%A0");
  });

  test("leaves a plain https URL unchanged", () => {
    expect(escapeMarkdownURL("https://spec.example/path?a=1&b=2#x")).toBe(
      "https://spec.example/path?a=1&b=2#x",
    );
  });
});
