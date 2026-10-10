import { describe, expect, it } from "vitest";

import { WIRE_FRAMEWORKS } from "../../lib/frameworks/index.mjs";
import {
  joinRoute,
  normalizeOutput,
  resolveLinkWiring,
} from "../../lib/frameworks/links.mjs";

type Row = [
  string,
  string,
  string | undefined,
  string,
  string,
  string | undefined,
];

const rows: Row[] = [
  [
    "starlight",
    "src/content/docs/api",
    undefined,
    "src/content/docs",
    "api",
    "/",
  ],
  [
    "starlight",
    "src/content/docs/api",
    "/repo",
    "src/content/docs",
    "api",
    "/repo",
  ],
  ["starlight", "src/content/docs", "/repo", "src/content/docs", ".", "/repo"],
  [
    "starlight",
    "src/content/docs/reference/api",
    "/repo",
    "src/content/docs/reference",
    "api",
    "/repo/reference",
  ],
  ["starlight", "docs/api", undefined, "docs", "api", undefined],
  ["fumadocs", "content/docs", undefined, "content/docs", ".", "/docs"],
  ["fumadocs", "content/docs/api", "/ignored", "content/docs", "api", "/docs"],
  ["docusaurus", "docs/api", undefined, "docs", "api", "/docs"],
  ["docusaurus", "docs", undefined, "docs", ".", "/docs"],
  ["vocs", "docs/pages/api", undefined, "docs/pages", "api", "/"],
  ["vocs", "docs/pages", undefined, "docs/pages", ".", "/"],
  ["nuxt", "content/docs", undefined, "content", "docs", "/"],
  ["hugo", "content/api", "/demo-hugo", "content", "api", "/demo-hugo"],
  ["honkit", "api", "/demo-honkit", ".", "api", "/demo-honkit"],
  ["mdbook", "src/api", undefined, "src", "api", undefined],
  ["mkdocs", "docs", undefined, "docs", ".", undefined],
  ["docfx", "docs/api", undefined, "docs", "api", undefined],
  ["generic", "foo/api", undefined, "foo", "api", undefined],
  ["generic", "api", undefined, ".", "api", undefined],
  [
    "starlight",
    "./src/content/docs/api/",
    undefined,
    "src/content/docs",
    "api",
    "/",
  ],
];

describe("resolveLinkWiring", () => {
  it.each(rows)(
    "%s %s (siteBase %s) -> rootPath %s, baseURL %s, linkRoot %s",
    (id, output, siteBase, rootPath, baseURL, linkRoot) => {
      const descriptor = WIRE_FRAMEWORKS[id as keyof typeof WIRE_FRAMEWORKS];
      expect(resolveLinkWiring(descriptor, output, { siteBase })).toEqual({
        rootPath,
        baseURL,
        linkRoot,
      });
    },
  );
});

describe("joinRoute", () => {
  it("collapses slashes and keeps a leading slash", () => {
    expect(joinRoute("/repo", "/")).toBe("/repo");
    expect(joinRoute("/", "")).toBe("/");
    expect(joinRoute("docs")).toBe("/docs");
  });
});

describe("normalizeOutput", () => {
  it("converts backslashes and strips leading ./ and trailing /", () => {
    expect(normalizeOutput("./src/content/docs/api/")).toBe(
      "src/content/docs/api",
    );
    expect(normalizeOutput("src\\content\\docs")).toBe("src/content/docs");
  });
});
