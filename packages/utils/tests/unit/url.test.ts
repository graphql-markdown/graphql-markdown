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

    test.each([".", "", "/"])(
      "treats baseURL %j as the output root",
      (baseURL) => {
        expect(
          toRelativeGeneratedDocLink({
            baseURL,
            currentFilePath: "/workspace/docs/types/objects/book.mdx",
            extension: ".mdx",
            outputDir: "/workspace/docs",
            targetUrlPath: "/types/scalars/id",
          }),
        ).toBe("../scalars/id.mdx");
      },
    );

    describe("with a root baseURL", () => {
      const run = (targetUrlPath: string, linkRoot?: string) =>
        toRelativeGeneratedDocLink({
          baseURL: "",
          currentFilePath: "/workspace/docs/types/objects/book.md",
          outputDir: "/workspace/docs",
          targetUrlPath,
          ...(linkRoot !== undefined && { linkRoot }),
        });

      test.each(["/guides/auth", "/img/logo.png", "//cdn.example.com/x"])(
        "leaves %s untouched",
        (url) => {
          expect(run(url)).toBeUndefined();
        },
      );

      test("still rewrites generated pages", () => {
        expect(run("/types/scalars/id")).toBe("../scalars/id.md");
        expect(run("/operations/queries/q")).toBe(
          "../../operations/queries/q.md",
        );
      });

      test("rewrites a flat page before it exists on disk", () => {
        expect(
          toRelativeGeneratedDocLink({
            baseURL: "",
            currentFilePath: "/workspace/docs/objects-user.md",
            knownDocPaths: new Set(["queries-book-by-id"]),
            outputDir: "/workspace/docs",
            targetUrlPath: "/queries-book-by-id",
          }),
        ).toBe("./queries-book-by-id.md");
      });

      test("rewrites pages in the current page's group folder", () => {
        expect(
          toRelativeGeneratedDocLink({
            baseURL: "/",
            currentFilePath: "/workspace/docs/shop/objects/book.md",
            outputDir: "/workspace/docs",
            targetUrlPath: "/shop/objects/author",
          }),
        ).toBe("./author.md");
      });

      test("strips a configured linkRoot", () => {
        expect(run("/docs/types/scalars/id", "/docs")).toBe("../scalars/id.md");
        expect(run("/docs/guides/auth", "/docs")).toBeUndefined();
      });
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
