import { describe, it, expect } from "vitest";
import {
  stripShikiCss,
  toSinglePageSearchSections,
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
