import { classifyPointer } from "../../src/loader";

describe("classifyPointer", () => {
  test.each([
    ["https://example.com/graphql", "url"],
    ["./schema.graphql", "file-sdl"],
    ["schema.gql", "file-sdl"],
    ["schema.json", "file-json"],
    ["src/**/*.graphql", "glob"],
    ["src/schema.ts", "code-file"],
    ["type Query { a: Int }", "inline-sdl"],
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
});
