import { classifyPointer, maskPointer } from "../../src/loader";

describe("classifyPointer", () => {
  test.each([
    ["https://example.com/graphql", "url"],
    ["./schema.graphql", "file-sdl"],
    ["schema.gql", "file-sdl"],
    ["schema.json", "file-json"],
    ["src/**/*.graphql", "glob"],
    ["src/schema.ts", "code-file"],
    ["type Query { a: Int }", "inline-sdl"],
    ["git:main:schema.graphql", "git"],
    ["github:acme/repo#main:schema.graphql", "github"],
    ["/abs/schema.graphql", "file-sdl"],
    ["C:\\x\\schema.graphql", "file-sdl"],
    ["C:\\x\\schema.json", "file-json"],
    ["C:\\x\\schema.ts", "code-file"],
    ["src/App.vue", "code-file"],
    ["src/App.svelte", "code-file"],
    ["src/App.astro", "code-file"],
    ["something", "unknown"],
    [42, "unknown"],
  ])("%j -> %s", (pointer, kind) => {
    expect(classifyPointer(pointer)).toBe(kind);
  });

  test("array gives a list of kinds", () => {
    expect(classifyPointer(["a.graphql", "https://x.test/g"])).toEqual([
      "file-sdl",
      "url",
    ]);
  });

  test("object form classifies keys and ignores options", () => {
    const secret = "Bearer s3cr3t";
    const one = {
      "https://api.acme.internal/graphql": {
        headers: { Authorization: secret },
      },
    };
    expect(classifyPointer(one)).toBe("url");
    const json = JSON.stringify(maskPointer(one));
    expect(json).toBe('"<url>"');
    expect(json).not.toContain(secret);
    expect(json).not.toContain("acme");
    expect(classifyPointer({ "a.graphql": {}, "https://x.test": {} })).toEqual([
      "file-sdl",
      "url",
    ]);
  });

  test("maskPointer gives tokens", () => {
    expect(maskPointer("git:main:a.graphql")).toBe("<git>");
    expect(maskPointer("github:a/b:x.json")).toBe("<github>");
    expect(maskPointer("a.json")).toBe("<file:json>");
    expect(maskPointer("a.ts")).toBe("<file:code>");
    expect(maskPointer("a/**/*.graphql")).toBe("<glob>");
    expect(maskPointer("type Query { a: Int }")).toBe("<inline-sdl>");
    expect(maskPointer(["a.graphql", "https://x.test"])).toEqual([
      "<file:sdl>",
      "<url>",
    ]);
  });
});
