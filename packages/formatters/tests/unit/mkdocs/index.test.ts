import {
  afterRenderTypeEntitiesHook,
  createMDXFormatter,
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
  mdxExtension,
} from "../../../src/mkdocs";

import * as Utils from "@graphql-markdown/utils";

jest.mock("@graphql-markdown/utils", () => {
  const actual = jest.requireActual("@graphql-markdown/utils");
  return {
    ...actual,
    readFile: jest.fn(),
    saveFile: jest.fn(),
  };
});

describe("formatMDXBadge", () => {
  test("renders inline mark tag", () => {
    expect(formatMDXBadge({ text: "Required" })).toBe(
      '<mark class="gqlmd-mkdocs-badge">Required</mark>',
    );
  });
});

describe("formatMDXAdmonition", () => {
  test("renders MkDocs Material admonition with 4-space-indented content", () => {
    const result = formatMDXAdmonition(
      { text: "body text", title: "My Title", type: "note" },
      null,
    );
    expect(result).toContain('!!! note "My Title"');
    expect(result).toContain("    body text");
  });

  test("maps deprecated type to warning", () => {
    const result = formatMDXAdmonition(
      { text: "old", title: "Deprecated", type: "deprecated" },
      null,
    );
    expect(result).toContain("!!! warning");
  });

  test("falls back to note for unknown type", () => {
    const result = formatMDXAdmonition(
      { text: "x", title: "T", type: "unknown" },
      null,
    );
    expect(result).toContain("!!! note");
  });

  test("omits title attribute when title is empty", () => {
    const result = formatMDXAdmonition(
      { text: "x", title: "", type: "tip" },
      null,
    );
    expect(result).toContain("!!! tip\n");
  });
});

describe("formatMDXBullet", () => {
  test("renders bull entity with text", () => {
    expect(formatMDXBullet("item")).toBe(
      '<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>item',
    );
  });

  test("renders bull entity with empty default", () => {
    expect(formatMDXBullet()).toBe(
      '<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>',
    );
  });
});

describe("formatMDXDetails", () => {
  test("renders HTML details block", () => {
    const result = formatMDXDetails({ dataOpen: "Show", dataClose: "Hide" });
    expect(result).toContain("<details>");
    expect(result).toContain("<summary>Show</summary>");
    expect(result).toContain("<em>Hide</em>");
  });
});

describe("formatMDXFrontmatter", () => {
  test("returns empty string when formatted is null", () => {
    expect(formatMDXFrontmatter(undefined, null)).toBe("");
  });

  test("renders heading from formatted title", () => {
    const result = formatMDXFrontmatter(undefined, ["title: Test", "id: foo"]);
    expect(result).toBe("# Test");
  });

  test("ignores props — title is sourced from formatted lines", () => {
    const result = formatMDXFrontmatter({ title: "Fallback" }, []);
    expect(result).toBe("");
  });

  test("renders heading from single-quoted title", () => {
    const result = formatMDXFrontmatter(undefined, ["title: 'My Title'"]);
    expect(result).toBe("# My Title");
  });

  test("renders heading from title with extra spacing", () => {
    const result = formatMDXFrontmatter(undefined, ["  title:   Test Value  "]);
    expect(result).toBe("# Test Value");
  });
});

describe("mdxExtension", () => {
  test("uses markdown extension", () => {
    expect(mdxExtension).toBe(".md");
  });
});

describe("formatMDXLink", () => {
  test("returns link unchanged", () => {
    const link = { text: "Type", url: "/schema/type" };
    expect(formatMDXLink(link)).toEqual(link);
  });
});

describe("formatMDXNameEntity", () => {
  test("renders backtick code with parent", () => {
    expect(formatMDXNameEntity("field", "Query")).toBe("`Query.field`");
  });

  test("renders backtick code without parent", () => {
    expect(formatMDXNameEntity("field")).toBe("`field`");
  });
});

describe("formatMDXSpecifiedByLink", () => {
  test("renders markdown link", () => {
    expect(formatMDXSpecifiedByLink("https://spec.example")).toBe(
      "[Specification ⎘](https://spec.example)",
    );
  });
});

describe("createMDXFormatter", () => {
  test("returns a complete formatter", () => {
    const formatter = createMDXFormatter();
    expect(formatter).toHaveProperty("formatMDXBadge");
    expect(formatter).toHaveProperty("formatMDXAdmonition");
    expect(formatter).toHaveProperty("formatMDXBullet");
    expect(formatter).toHaveProperty("formatMDXDetails");
    expect(formatter).toHaveProperty("formatMDXFrontmatter");
    expect(formatter).toHaveProperty("formatMDXLink");
    expect(formatter).toHaveProperty("formatMDXNameEntity");
    expect(formatter).toHaveProperty("formatMDXSpecifiedByLink");
  });
});

describe("afterRenderTypeEntitiesHook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("rewrites baseURL absolute links to relative markdown links", async () => {
    const readFileMock = jest.mocked(Utils.readFile);
    const saveFileMock = jest.mocked(Utils.saveFile);

    readFileMock.mockResolvedValue(
      "See [Book](/graphql/types/objects/book) and [ID](/graphql/types/scalars/id#value)",
    );
    saveFileMock.mockResolvedValue(undefined);

    await afterRenderTypeEntitiesHook({
      data: {
        baseURL: "graphql",
        filePath: "/workspace/docs/graphql/operations/queries/book-by-id.md",
        outputDir: "/workspace/docs/graphql",
      },
    });

    expect(saveFileMock).toHaveBeenCalledWith(
      "/workspace/docs/graphql/operations/queries/book-by-id.md",
      "See [Book](../../types/objects/book.md) and [ID](../../types/scalars/id.md#value)",
    );
  });

  test("leaves non-baseURL absolute links unchanged", async () => {
    const readFileMock = jest.mocked(Utils.readFile);
    const saveFileMock = jest.mocked(Utils.saveFile);

    readFileMock.mockResolvedValue(
      "See [Site](/other/path) and [Spec](https://example.com)",
    );
    saveFileMock.mockResolvedValue(undefined);

    await afterRenderTypeEntitiesHook({
      data: {
        baseURL: "graphql",
        filePath: "/workspace/docs/graphql/types/objects/book.md",
        outputDir: "/workspace/docs",
      },
    });

    expect(saveFileMock).not.toHaveBeenCalled();
  });
});
