import {
  __default,
  afterRenderTypeEntitiesHook,
  createMDXFormatter,
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXNameEntity,
  formatMDXPermalink,
  formatMDXSpecifiedByLink,
  mdxExtension,
} from "../../../src/mkdocs";

const { formatMDXBullet, formatMDXLink } = __default;

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

describe("formatMDXPermalink", () => {
  test("renders permalink with proper formatting", () => {
    expect(formatMDXPermalink("foo")).toBe("{#foo}");
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
  const outputAdapter = {
    writeFile: vi.fn(),
    readFile: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rewrites baseURL absolute links to relative markdown links", async () => {
    outputAdapter.readFile.mockResolvedValue(
      "See [Book](/graphql/types/objects/book) and [ID](/graphql/types/scalars/id#value)",
    );

    await afterRenderTypeEntitiesHook({
      data: {
        baseURL: "graphql",
        filePath: "/workspace/docs/graphql/operations/queries/book-by-id.md",
        outputDir: "/workspace/docs/graphql",
        outputAdapter,
      },
    });

    expect(outputAdapter.writeFile).toHaveBeenCalledWith(
      "/workspace/docs/graphql/operations/queries/book-by-id.md",
      "See [Book](../../types/objects/book.md) and [ID](../../types/scalars/id.md#value)",
    );
  });

  test("leaves non-baseURL absolute links unchanged", async () => {
    outputAdapter.readFile.mockResolvedValue(
      "See [Site](/other/path) and [Spec](https://example.com)",
    );

    await afterRenderTypeEntitiesHook({
      data: {
        baseURL: "graphql",
        filePath: "/workspace/docs/graphql/types/objects/book.md",
        outputDir: "/workspace/docs",
        outputAdapter,
      },
    });

    expect(outputAdapter.writeFile).not.toHaveBeenCalled();
  });

  test("reports the first page that cannot be read back, then stays quiet", async () => {
    // a write-only destination fails on every page, so it must be reported once
    // rather than once per page
    const writeOnly = {
      writeFile: vi.fn(),
      readFile: vi.fn().mockResolvedValue(undefined),
    };
    const data = {
      baseURL: "graphql",
      filePath: "/workspace/docs/graphql/types/objects/book.md",
      outputDir: "/workspace/docs",
      outputAdapter: writeOnly,
    };

    await expect(afterRenderTypeEntitiesHook({ data })).rejects.toThrow(
      "Cannot read back",
    );

    await expect(
      afterRenderTypeEntitiesHook({ data }),
    ).resolves.toBeUndefined();
    expect(writeOnly.writeFile).not.toHaveBeenCalled();
  });
});
