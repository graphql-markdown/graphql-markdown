// packages/utils/tests/unit/url.test.ts
import { join, resolve, toRelativeGeneratedDocLink } from "../../src/url";

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

  describe("toRelativeGeneratedDocLink()", () => {
    test("converts a generated doc URL to a page-relative markdown path", () => {
      expect(
        toRelativeGeneratedDocLink({
          baseURL: "graphql",
          currentFilePath:
            "/workspace/docs/graphql/operations/queries/book-by-id.md",
          outputDir: "/workspace/docs/graphql",
          targetUrlPath: "/graphql/types/objects/book",
        }),
      ).toBe("../../types/objects/book.md");
    });

    test("preserves hash fragments at the caller level by returning only the path", () => {
      expect(
        toRelativeGeneratedDocLink({
          baseURL: "graphql",
          currentFilePath: "/workspace/docs/graphql/types/objects/book.md",
          outputDir: "/workspace/docs/graphql",
          targetUrlPath: "/graphql/operations/queries/book-by-id",
        }),
      ).toBe("../../operations/queries/book-by-id.md");
    });

    test("returns undefined for URLs outside the configured baseURL", () => {
      expect(
        toRelativeGeneratedDocLink({
          baseURL: "graphql",
          currentFilePath: "/workspace/docs/graphql/types/objects/book.md",
          outputDir: "/workspace/docs/graphql",
          targetUrlPath: "/other/path",
        }),
      ).toBeUndefined();
    });
  });
});
