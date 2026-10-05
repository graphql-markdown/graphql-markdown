import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ApiSinglePageBucket } from "../../app/composables/useApiSinglePage";

vi.mock("shiki", () => {
  return {
    codeToHtml: vi.fn(async (code: string) => {
      return `<pre>${code}</pre>`;
    }),
  };
});

const createRef = (value: unknown) => {
  return { value };
};
const createComputed = (getter: () => unknown) => {
  return { value: getter() };
};

const mockUseAsyncData = vi.fn();
const mockUseAppConfig = vi.fn();
const mockQueryCollection = vi.fn();

globalThis.useAsyncData = mockUseAsyncData;
globalThis.useAppConfig = mockUseAppConfig;
globalThis.queryCollection = mockQueryCollection;
globalThis.computed = createComputed;

const { useApiSinglePage, useApiSinglePageNavigation } =
  await import("../../app/composables/useApiSinglePage");

/** A minimal but realistic MDC body: a GraphQL definition, a description, and one `h3` section. */
const pageBody = (
  definitionCode: string,
  description: string,
  options: { deprecatedNotice?: string } = {},
) => {
  const value: unknown[] = [];
  if (options.deprecatedNotice) value.push(options.deprecatedNotice);
  value.push(["pre", { language: "graphql", code: definitionCode }]);
  value.push(description);
  value.push(["h3", { id: "fields" }, "Fields"]);
  value.push("field docs");
  return { value };
};

const setUpPages = (
  pages: {
    path: string;
    title: string;
    kind?: string;
    body: { value: unknown[] };
  }[],
) => {
  mockQueryCollection.mockReturnValue({
    order: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    all: vi.fn().mockResolvedValue(
      pages.map((page) => {
        return { ...page, meta: { kind: page.kind } };
      }),
    ),
  });

  mockUseAsyncData.mockImplementation(
    async (_key: string, callback: () => Promise<unknown>) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    },
  );

  mockUseAppConfig.mockReturnValue({
    gqlmd: {
      baseURL: "api-reference",
      shikiTheme: "github-dark",
      singlePage: true,
    },
  });
};

describe("useApiSinglePage", () => {
  beforeEach(() => {
    mockUseAsyncData.mockClear();
    mockUseAppConfig.mockClear();
    mockQueryCollection.mockClear();
  });

  it("groups entries into Queries, Mutations, Types buckets, in that order, omitting empty buckets", async () => {
    setUpPages([
      {
        path: "/api-reference/get-user",
        title: "GetUser",
        kind: "queries",
        body: pageBody("type Query { getUser: User }", "Fetch a user."),
      },
      {
        path: "/api-reference/user",
        title: "User",
        kind: "objects",
        body: pageBody("type User { id: ID! }", "A user."),
      },
      {
        path: "/api-reference/id",
        title: "ID",
        kind: "scalars",
        body: pageBody("scalar ID", "An ID."),
      },
    ]);

    const { buckets } = await useApiSinglePage();
    const bucketIds = buckets.value.map((bucket: ApiSinglePageBucket) => {
      return bucket.id;
    });

    // No mutations/subscriptions in the fixture, so those buckets are absent
    // rather than rendered empty.
    expect(bucketIds).toEqual(["queries", "types"]);

    const queries = buckets.value.find((bucket: ApiSinglePageBucket) => {
      return bucket.id === "queries";
    })!;
    expect(
      queries.entries.map((entry) => {
        return entry.title;
      }),
    ).toEqual(["GetUser"]);

    const types = buckets.value.find((bucket: ApiSinglePageBucket) => {
      return bucket.id === "types";
    })!;
    // Objects and scalars share the flat "types" bucket, sorted alphabetically.
    expect(
      types.entries.map((entry) => {
        return entry.title;
      }),
    ).toEqual(["ID", "User"]);
  });

  it("returns empty buckets without querying when disabled", async () => {
    setUpPages([
      {
        path: "/api-reference/user",
        title: "User",
        kind: "objects",
        body: pageBody("type User { id: ID! }", "A user."),
      },
    ]);

    const { buckets } = await useApiSinglePage(false);

    expect(buckets.value).toEqual([]);
    expect(mockQueryCollection).not.toHaveBeenCalled();
    expect(mockUseAsyncData.mock.calls[0][0]).toBe(
      "api-reference-single-page-disabled",
    );
  });

  it("reads the anchor id from the page's own (already-unique) path segment", async () => {
    // @graphql-markdown/core's flat-hierarchy renderer already disambiguates
    // a same-named query and type by prefixing the generated *filename*
    // itself with the entity kind (`queries-user.mdx` vs `objects-user.mdx`)
    // — so by the time pages reach here their paths are already distinct;
    // this composable must not add a second prefix on top of that one.
    setUpPages([
      {
        path: "/api-reference/queries-user",
        title: "user",
        kind: "queries",
        body: pageBody("type Query { user: User }", "Fetch a user."),
      },
      {
        path: "/api-reference/objects-user",
        title: "User",
        kind: "objects",
        body: pageBody("type User { id: ID! }", "A user."),
      },
    ]);

    const { buckets } = await useApiSinglePage();
    const anchorIds = buckets.value.flatMap((bucket: ApiSinglePageBucket) => {
      return bucket.entries.map((entry) => {
        return entry.anchorId;
      });
    });

    expect(new Set(anchorIds).size).toBe(anchorIds.length);
    expect(anchorIds).toContain("queries-user");
    expect(anchorIds).toContain("objects-user");
  });

  it("carries the schema-kind badge label per entry", async () => {
    setUpPages([
      {
        path: "/api-reference/id",
        title: "ID",
        kind: "scalars",
        body: pageBody("scalar ID", "An ID."),
      },
    ]);

    const { buckets } = await useApiSinglePage();
    const entry = buckets.value[0]!.entries[0]!;

    expect(entry.kindLabel).toBe("SCALAR");
  });

  it("flags a deprecated entry and carries its reason", async () => {
    setUpPages([
      {
        path: "/api-reference/legacy-project",
        title: "LegacyProject",
        kind: "objects",
        body: pageBody("type LegacyProject { id: ID! }", "An old project.", {
          deprecatedNotice: "Replaced by `Project`.",
        }),
      },
    ]);

    const { buckets } = await useApiSinglePage();
    const entry = buckets.value[0]!.entries[0]!;

    expect(entry.isDeprecated).toBe(true);
    expect(entry.deprecationReason).toBe("Replaced by `Project`.");
  });

  it("highlights the SDL definition into a definition card", async () => {
    setUpPages([
      {
        path: "/api-reference/id",
        title: "ID",
        kind: "scalars",
        body: pageBody("scalar ID", "An ID."),
      },
    ]);

    const { buckets } = await useApiSinglePage();
    const entry = buckets.value[0]!.entries[0]!;

    expect(entry.definitionCard?.code).toBe("scalar ID");
    expect(entry.definitionCard?.html).toContain("scalar ID");
  });
});

describe("useApiSinglePageNavigation", () => {
  it("builds an anchor tree whose leaves link to in-page hashes, not routes", () => {
    const buckets: ApiSinglePageBucket[] = [
      {
        id: "queries",
        title: "Queries",
        entries: [
          {
            anchorId: "queries-get-user",
            title: "GetUser",
            kindLabel: "QUERY",
            isDeprecated: false,
            sections: [],
          },
        ],
      },
    ];

    const nav = useApiSinglePageNavigation(buckets);

    expect(nav).toHaveLength(1);
    const branch = nav[0] as {
      title: string;
      children: { title: string; path: string }[];
    };
    expect(branch.title).toBe("Queries");
    expect(branch.children[0]!.path).toBe("#queries-get-user");
  });
});
