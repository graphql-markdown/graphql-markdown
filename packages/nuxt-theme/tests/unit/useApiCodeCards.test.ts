import { describe, it, expect, vi } from "vitest";

vi.mock("shiki", () => {
  return {
    codeToHtml: vi.fn(async (code: string, options: { lang: string }) => {
      return `<pre data-lang="${options.lang}">${code}</pre>`;
    }),
  };
});

const { useApiCodeCards, detectLanguage } =
  await import("../../app/composables/useApiCodeCards");

const nodes = [
  ["pre", { language: "graphql", code: "type A" }],
  ["h3", {}, "Example"],
  ["pre", { language: "graphql", code: '{"a": 1}' }],
  ["h3", {}, "Example Response"],
  ["pre", { language: "graphql", code: '{"b": 2}' }],
];

describe("detectLanguage", () => {
  it("detects JSON and falls back to graphql", () => {
    expect(detectLanguage('{"a":1}')).toBe("json");
    expect(detectLanguage("type A")).toBe("graphql");
  });
});

describe("useApiCodeCards", () => {
  it("builds the definition card and example cards for operations", async () => {
    const result = await useApiCodeCards(
      { value: nodes } as never,
      { value: "Query" },
      { value: true },
      "github-dark",
    );

    expect(result.definitionCard).toMatchObject({
      label: "SDL",
      kind: "Query",
      code: "type A",
    });
    expect(result.definitionCard?.html).toContain('data-lang="graphql"');
    expect(
      result.exampleCards.map((c) => {
        return [c.label, c.kind];
      }),
    ).toEqual([
      ["Example", "Query"],
      ["Response", "JSON"],
    ]);
    expect(result.exampleCards[0].html).toContain('data-lang="json"');
  });

  it("skips operation-only examples for non-operations", async () => {
    const result = await useApiCodeCards(
      { value: nodes } as never,
      { value: "Object" },
      { value: false },
      "github-dark",
    );

    expect(
      result.exampleCards.map((c) => {
        return c.label;
      }),
    ).toEqual(["Example"]);
  });

  const nodesWithVariables = [
    ["pre", { language: "graphql", code: "type A" }],
    ["h3", {}, "Example"],
    ["pre", { language: "graphql", code: "query { a }" }],
    ["h3", {}, "Example Variables"],
    ["pre", { language: "json", code: '{"id": "1"}' }],
    ["h3", {}, "Example Response"],
    ["pre", { language: "graphql", code: '{"b": 2}' }],
  ];

  it("stacks example variables under the Example card", async () => {
    const result = await useApiCodeCards(
      { value: nodesWithVariables } as never,
      { value: "Query" },
      { value: true },
      "github-dark",
    );

    expect(
      result.exampleCards.map((c) => {
        return c.label;
      }),
    ).toEqual(["Example", "Response"]);
    expect(result.exampleCards[0].variables?.code).toBe('{"id": "1"}');
    expect(result.exampleCards[0].variables?.html).toContain(
      'data-lang="json"',
    );
  });

  it("ignores example variables for non-operations", async () => {
    const result = await useApiCodeCards(
      { value: nodesWithVariables } as never,
      { value: "Object" },
      { value: false },
      "github-dark",
    );

    expect(result.exampleCards).toHaveLength(1);
    expect(result.exampleCards[0].variables).toBeUndefined();
  });

  it("drops cards without code", async () => {
    const result = await useApiCodeCards(
      { value: [] } as never,
      { value: "Object" },
      { value: true },
      "github-dark",
    );

    expect(result.definitionCard).toBeUndefined();
    expect(result.exampleCards).toEqual([]);
  });
});
