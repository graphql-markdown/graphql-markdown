import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => {
  return {
    route: { path: "/api-reference/types/objects/user" },
    page: { value: null as Record<string, any> | null },
    isFlat: { value: false },
    first: vi.fn(),
    path: vi.fn(),
    navigateTo: vi.fn(),
    useSeoMeta: vi.fn(),
    overviewGroupsFor: vi.fn(() => {
      return ["group"];
    }),
    useApiCodeCards: vi.fn(),
    sections: { value: ["section"] as string[] },
    createError: vi.fn((input: Record<string, unknown>) => {
      return Object.assign(new Error(String(input.statusMessage)), input);
    }),
  };
});

vi.mock("../../app/composables/useApiSinglePage", () => {
  return {
    anchorIdFor: (page: { path: string }) => {
      return `anchor-${page.path}`;
    },
  };
});

Object.assign(globalThis, {
  useNuxtApp: () => {
    return {
      runWithContext: (callback: () => unknown) => {
        return callback();
      },
    };
  },
  computed: (getter: () => unknown) => {
    return {
      get value() {
        return getter();
      },
    };
  },
  useRoute: () => {
    return mocks.route;
  },
  useAppConfig: () => {
    return { gqlmd: { shikiTheme: "github-dark" } };
  },
  useApiBaseURL: () => {
    return { value: "/api-reference" };
  },
  schemaKindLabel: (category?: string) => {
    return `kind:${category}`;
  },
  isOperationCategory: (category?: string) => {
    return category === "operations";
  },
  queryCollection: () => {
    return { path: mocks.path };
  },
  useAsyncData: async (_key: string, callback: () => Promise<unknown>) => {
    mocks.page.value = (await callback()) as Record<string, any> | null;
    return { data: mocks.page };
  },
  useApiNavigation: async () => {
    return {
      sections: mocks.sections,
      overviewGroupsFor: mocks.overviewGroupsFor,
    };
  },
  useHierarchyMode: async () => {
    return { isFlat: mocks.isFlat };
  },
  useApiSinglePage: async () => {
    return { buckets: { value: ["bucket"] } };
  },
  buildBreadcrumbs: (segments: string[], title: string | undefined) => {
    return [segments.join("/"), title];
  },
  useApiDocument: () => {
    return {
      documentBody: { value: [] },
      deprecationReason: { value: undefined },
      document: { value: {} },
    };
  },
  useApiCodeCards: mocks.useApiCodeCards,
  navigateTo: mocks.navigateTo,
  createError: mocks.createError,
  useSeoMeta: mocks.useSeoMeta,
});

const { useApiReferencePage } =
  await import("../../app/composables/useApiReferencePage");

describe("useApiReferencePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.route.path = "/api-reference/types/objects/user";
    mocks.isFlat.value = false;
    mocks.sections.value = ["section"];
    mocks.path.mockReturnValue({ first: mocks.first });
    mocks.useApiCodeCards.mockResolvedValue({
      definitionCard: "def",
      exampleCards: [],
    });
  });

  it("loads the exact page and sets SEO metadata", async () => {
    mocks.first.mockResolvedValueOnce({
      path: "/api-reference/types/objects/user",
      title: "User",
      description: "desc",
    });

    const result = await useApiReferencePage();

    expect(mocks.path).toHaveBeenCalledTimes(1);
    expect(result.isLandingPage.value).toBe(false);
    expect(result.isNamespaceChooser.value).toBe(false);
    expect(result.overviewGroups.value).toEqual([]);
    expect(result.breadcrumbs.value).toEqual([
      "api-reference/types/objects/user",
      "User",
    ]);
    expect(mocks.useApiCodeCards.mock.calls[0][3]).toBe("github-dark");
    expect(mocks.useSeoMeta).toHaveBeenCalledWith({
      title: "API Reference | User",
      description: "desc",
    });
    expect(mocks.navigateTo).not.toHaveBeenCalled();
  });

  it("falls back to the generated landing page", async () => {
    mocks.route.path = "/api-reference/";
    mocks.first.mockResolvedValueOnce(null).mockResolvedValueOnce({
      path: "/api-reference/generated",
      title: "Schema",
    });

    const result = await useApiReferencePage();

    expect(mocks.path).toHaveBeenLastCalledWith("/api-reference/generated");
    expect(result.isLandingPage.value).toBe(true);
    expect(result.overviewGroups.value).toEqual(["group"]);
    expect(mocks.useSeoMeta).toHaveBeenCalledWith({
      title: "Schema",
      description: undefined,
    });
  });

  it("redirects to the anchor in flat mode", async () => {
    mocks.isFlat.value = true;
    mocks.first.mockResolvedValueOnce({
      path: "/api-reference/types/objects/user",
      title: "User",
      meta: { kind: "object" },
    });

    await useApiReferencePage();

    expect(mocks.navigateTo).toHaveBeenCalledWith(
      "/api-reference#anchor-/api-reference/types/objects/user",
      { redirectCode: 301 },
    );
  });

  it("keeps the namespace chooser at the base route when no page is found", async () => {
    mocks.route.path = "/api-reference/";
    mocks.first.mockResolvedValue(null);

    const result = await useApiReferencePage();

    expect(result.page.value).toBeNull();
    expect(result.breadcrumbs.value[1]).toBeUndefined();
    expect(mocks.useSeoMeta).not.toHaveBeenCalled();
    expect(mocks.createError).not.toHaveBeenCalled();
    expect(result.isNamespaceChooser.value).toBe(true);
  });

  it("throws a 404 for a path with no generated page", async () => {
    mocks.route.path = "/api-reference/operations/queries/missing";
    mocks.first.mockResolvedValue(null);

    await expect(useApiReferencePage()).rejects.toMatchObject({
      statusCode: 404,
      fatal: true,
    });
  });

  it("throws a 404 at the base route when there are no sections", async () => {
    mocks.route.path = "/api-reference";
    mocks.sections.value = [];
    mocks.first.mockResolvedValue(null);

    await expect(useApiReferencePage()).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
