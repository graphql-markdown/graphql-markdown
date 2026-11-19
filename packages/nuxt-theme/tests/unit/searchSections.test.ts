import { describe, it, expect } from "vitest";
import {
  normalizeSearchText,
  stripShikiCss,
  toSinglePageSearchSections,
  withSearchGroupIds,
} from "../../app/utils/search-sections";

const section = (over: Record<string, unknown> = {}) => {
  return {
    id: "/api-reference/queries-projects",
    title: "projects {#queries-projects}",
    titles: ["Queries {#q}"],
    level: 1,
    content: "List projects",
    ...over,
  } as never as Parameters<typeof toSinglePageSearchSections>[0][number];
};

describe("stripShikiCss", () => {
  it("removes repeated shiki rules and collapses whitespace", () => {
    const css =
      "html .light .shiki span {color: var(--shiki-light);}  html .shiki span {color: var(--shiki-default);}";
    expect(stripShikiCss(`Before ${css} ${css} after`)).toBe("Before after");
  });

  it("leaves other content alone", () => {
    expect(stripShikiCss("a   b\n c")).toBe("a b c");
  });

  it("stops on an unterminated rule", () => {
    expect(stripShikiCss("x .shiki span {color")).toBe("x .shiki span {color");
  });
});

describe("toSinglePageSearchSections", () => {
  it("points sections at the entry anchor in flat mode", () => {
    const [top, deep] = toSinglePageSearchSections(
      [
        section(),
        section({
          id: "/api-reference/directives-deprecated#arguments",
          level: 2,
        }),
      ],
      true,
    );
    expect(top!.id).toBe("#queries-projects");
    expect(deep!.id).toBe("#directives-deprecated");
    expect(top!.title).toBe("projects");
    expect(top!.titles).toEqual(["Queries"]);
    expect(deep!.level).toBe(2);
  });

  it("keeps ids outside flat mode but still cleans", () => {
    const [file] = toSinglePageSearchSections([section()], false);
    expect(file!.id).toBe("/api-reference/queries-projects");
    expect(file!.title).toBe("projects");
  });
});

describe("withSearchGroupIds", () => {
  it("gives pathless branches a slug-based path", () => {
    const [group] = withSearchGroupIds([
      { title: "Queries & Mutations", children: [{ title: "a", path: "/a" }] },
    ]);
    expect(group!.path).toBe("search-group-queries-mutations");
  });

  it("falls back to the index when the title slug is empty", () => {
    const [first, second] = withSearchGroupIds([
      { title: "", children: [] },
      { title: "", children: [] },
    ]);
    expect(first!.path).toBe("search-group-0");
    expect(second!.path).toBe("search-group-1");
  });

  it("leaves leaves and nodes with a path untouched", () => {
    const leaf = { title: "Leaf", path: "/leaf" };
    const withPath = { title: "Keep", path: "/keep", children: [] };
    const [a, b] = withSearchGroupIds([leaf, withPath]);
    expect(a).toEqual(leaf);
    expect(b).toEqual(withPath);
    expect("path" in a!).toBe(true);
  });

  it("does not mutate the input", () => {
    const input = [{ title: "Group", children: [] as unknown[] }];
    const out = withSearchGroupIds(input);
    expect(input[0]).not.toHaveProperty("path");
    expect(out[0]).not.toBe(input[0]);
    expect(out[0]!.path).toBe("search-group-group");
  });
});

describe("normalizeSearchText", () => {
  it("removes characters Nuxt UI escapes into multi-char entities", () => {
    expect(normalizeSearchText(`{ "a": 'b' } & <c>`)).toBe(
      "{ a: \u2019b\u2019 } + \u2039c\u203A",
    );
  });

  it("is applied to title, titles and content", () => {
    const [out] = toSinglePageSearchSections(
      [section({ title: `"T" {#t}`, titles: [`It's`], content: `a & "b"` })],
      false,
    );
    expect(out!.title).toBe("T");
    expect(out!.titles).toEqual(["It\u2019s"]);
    expect(out!.content).toBe("a + b");
  });
});
