import { describe, it, expect } from "vitest";
import {
  countLeaves,
  getFirstLeafPath,
  itemKey,
} from "../../app/utils/navigation-tree";

const leaf = (title: string, path: string) => {
  return { title, path } as never;
};
const branch = (title: string, children: unknown[]) => {
  return { title, children } as never;
};

describe("navigation-tree", () => {
  it("builds item keys", () => {
    expect(itemKey(leaf("A", "/a"))).toBe("A");
    expect(
      itemKey({ title: "A", path: "/a", sectionTitle: "S" } as never),
    ).toBe("S-A");
  });

  it("finds the first leaf path", () => {
    expect(getFirstLeafPath(leaf("A", "/a"))).toBe("/a");
    expect(
      getFirstLeafPath(
        branch("B", [branch("empty", []), leaf("C", "/c"), leaf("D", "/d")]),
      ),
    ).toBe("/c");
    expect(getFirstLeafPath(branch("B", []))).toBeUndefined();
  });

  it("counts leaves", () => {
    expect(countLeaves(leaf("A", "/a"))).toBe(1);
    expect(
      countLeaves(
        branch("B", [leaf("C", "/c"), branch("E", [leaf("D", "/d")])]),
      ),
    ).toBe(2);
  });
});
