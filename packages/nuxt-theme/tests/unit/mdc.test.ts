import { describe, it, expect } from "vitest";
import {
  childrenOf,
  findByClass,
  hasClass,
  isElement,
  nodeClasses,
  nodeText,
  type MdcNode,
} from "../../app/utils/mdc";

describe("mdc helpers", () => {
  it("identifies elements and their children", () => {
    expect(isElement(["p", {}], "p")).toBe(true);
    expect(isElement(["p", {}], "h3")).toBe(false);
    expect(isElement("text")).toBe(false);
    expect(childrenOf("text")).toEqual([]);
    expect(childrenOf(["p", {}, "a", "b"])).toEqual(["a", "b"]);
  });

  it("flattens text", () => {
    expect(nodeText(["p", {}, "Replaced by ", ["code", {}, "X"]])).toBe(
      "Replaced by X",
    );
  });

  it("reads classes from className, class or nothing", () => {
    expect(nodeClasses(["p", { className: ["a", "b"] }])).toEqual(["a", "b"]);
    expect(nodeClasses(["p", { class: "a b" }])).toEqual(["a", "b"]);
    expect(nodeClasses("text")).toEqual([""]);
    expect(hasClass(["p", { class: "a b" }], "b")).toBe(true);
    expect(hasClass(["p", {}], "b")).toBe(false);
  });

  it("finds the first descendant with a class", () => {
    const inner: MdcNode = ["span", { class: "target" }, "x"];
    const tree: MdcNode = ["div", {}, "text", ["p", {}, inner]];

    expect(findByClass(tree, "target")).toBe(inner);
    expect(findByClass(inner, "target")).toBe(inner);
    expect(findByClass(tree, "missing")).toBeUndefined();
    expect(findByClass("text", "target")).toBeUndefined();
  });
});
