// packages/utils/tests/unit/url.test.ts
import { join, resolve } from "../../src/url";

describe("url", () => {
  describe("join()", () => {
    test("correctly joins URL path segments", () => {
      expect.assertions(3);

      expect(join("foo", "bar")).toBe("foo/bar");
      expect(join("/foo", "bar")).toBe("/foo/bar");
      expect(join("foo", "/bar")).toBe("foo/bar");
    });
  });

  describe("resolve()", () => {
    test("correctly resolves URL paths", () => {
      expect.assertions(2);

      expect(resolve("/foo/bar", "../baz")).toBe("/foo/baz");
      expect(resolve("foo", "bar")).toBe(process.cwd() + "/foo/bar");
    });
  });
});
