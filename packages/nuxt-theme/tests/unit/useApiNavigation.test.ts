import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  ApiNavigationNode,
  ApiNavigationLeaf,
} from "../../app/composables/useApiNavigation";

// Mock the utils module before importing the composable
vi.mock("~/utils/api-document", () => {
  return {
    findDeprecationNotice: (body: string) => {
      return body.toLowerCase().includes("deprecated");
    },
    titleCase: (str: string) => {
      return str
        .split("-")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    },
  };
});

// Create minimal mock implementations for Vue's ref and computed
// These don't need to be fully functional - just need to track values
const createRef = (value: unknown) => {
  return {
    value,
  };
};

const createComputed = (getter: () => unknown) => {
  return {
    value: getter(),
  };
};

// Mock Nuxt globals that are not available in plain vitest environment
const mockUseAsyncData = vi.fn();
const mockUseAppConfig = vi.fn();
const mockQueryCollection = vi.fn();

// Setup global mocks before importing the composable
globalThis.useAsyncData = mockUseAsyncData;
globalThis.useAppConfig = mockUseAppConfig;
globalThis.queryCollection = mockQueryCollection;
globalThis.computed = createComputed;

// Now import the composable after globals are set up
const { useApiNavigation } =
  await import("../../app/composables/useApiNavigation");

describe("useApiNavigation", () => {
  beforeEach(() => {
    mockUseAsyncData.mockClear();
    mockUseAppConfig.mockClear();
    mockQueryCollection.mockClear();
  });

  it("returns sections and overviewGroupsFor when called", async () => {
    mockQueryCollection.mockReturnValue({
      order: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue([]),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useApiNavigation();

    expect(result).toHaveProperty("sections");
    expect(result).toHaveProperty("overviewGroupsFor");
    expect(typeof result.overviewGroupsFor).toBe("function");
  });

  // fallow-ignore-next-line complexity
  it("builds a 2-level tree (section/group/item) with rootDepth=1", async () => {
    const mockPages = [
      {
        path: "/api-reference/types/objects/user",
        title: "User",
        body: "User type documentation",
      },
      {
        path: "/api-reference/types/objects/profile",
        title: "Profile",
        body: "Profile type documentation",
      },
      {
        path: "/api-reference/operations/queries/user",
        title: "GetUser",
        body: "Query documentation",
      },
    ];

    mockQueryCollection.mockReturnValue({
      order: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useApiNavigation();
    const sections = result.sections.value;

    // Verify top-level sections (Types, Operations)
    expect(sections).toHaveLength(2);

    const typeSection = sections.find(
      (s): s is ApiNavigationNode & { title: string } => {
        return "children" in s && s.title === "Types";
      },
    );
    const operationsSection = sections.find(
      (s): s is ApiNavigationNode & { title: string } => {
        return "children" in s && s.title === "Operations";
      },
    );

    expect(typeSection).toBeDefined();
    expect(operationsSection).toBeDefined();

    // Verify Types has Objects group with User and Profile
    if (typeSection && "children" in typeSection) {
      expect(typeSection.children).toHaveLength(1);
      const objectsGroup = typeSection.children[0];
      if (
        objectsGroup &&
        "children" in objectsGroup &&
        objectsGroup.title === "Objects"
      ) {
        expect(objectsGroup.children).toHaveLength(2);
        const userLeaf = objectsGroup.children.find(
          (c): c is ApiNavigationLeaf => {
            return (
              "path" in c && c.path === "/api-reference/types/objects/user"
            );
          },
        );
        expect(userLeaf).toBeDefined();
        expect(userLeaf?.title).toBe("User");
      }
    }

    // Verify Operations has Queries group with GetUser
    if (operationsSection && "children" in operationsSection) {
      expect(operationsSection.children).toHaveLength(1);
      const queriesGroup = operationsSection.children[0];
      if (
        queriesGroup &&
        "children" in queriesGroup &&
        queriesGroup.title === "Queries"
      ) {
        expect(queriesGroup.children).toHaveLength(1);
        const getUserLeaf = queriesGroup.children.find(
          (c): c is ApiNavigationLeaf => {
            return (
              "path" in c && c.path === "/api-reference/operations/queries/user"
            );
          },
        );
        expect(getUserLeaf).toBeDefined();
        expect(getUserLeaf?.title).toBe("GetUser");
      }
    }
  });

  it("handles 3-level paths (multi-schema) with separate branches for each schema", async () => {
    const mockPages = [
      {
        path: "/api-reference/schema-a/types/user",
        title: "User",
        body: "User in schema-a",
      },
      {
        path: "/api-reference/schema-a/types/profile",
        title: "Profile",
        body: "Profile in schema-a",
      },
      {
        path: "/api-reference/schema-b/types/user",
        title: "User",
        body: "User in schema-b",
      },
      {
        path: "/api-reference/schema-b/operations/queries/fetch-user",
        title: "FetchUser",
        body: "Query in schema-b",
      },
    ];

    mockQueryCollection.mockReturnValue({
      order: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useApiNavigation();
    const sections = result.sections.value;

    // Verify two top-level schema branches exist separately
    const schemaA = sections.find(
      (s): s is ApiNavigationNode & { title: string } => {
        return "children" in s && s.title === "Schema A";
      },
    );
    const schemaB = sections.find(
      (s): s is ApiNavigationNode & { title: string } => {
        return "children" in s && s.title === "Schema B";
      },
    );

    expect(schemaA).toBeDefined();
    expect(schemaB).toBeDefined();

    // Verify schema-a has its own Types group with User and Profile
    if (schemaA && "children" in schemaA) {
      const typesGroup = schemaA.children.find(
        (c): c is ApiNavigationNode & { title: string } => {
          return "children" in c && c.title === "Types";
        },
      );
      expect(typesGroup).toBeDefined();
      if (typesGroup && "children" in typesGroup) {
        const userA = typesGroup.children.find((c): c is ApiNavigationLeaf => {
          return "path" in c && c.path === "/api-reference/schema-a/types/user";
        });
        expect(userA).toBeDefined();
      }
    }

    // Verify schema-b has its own Types and Operations groups
    if (schemaB && "children" in schemaB) {
      expect(schemaB.children).toHaveLength(2); // Types and Operations
      const typesGroup = schemaB.children.find(
        (c): c is ApiNavigationNode & { title: string } => {
          return "children" in c && c.title === "Types";
        },
      );
      const opsGroup = schemaB.children.find(
        (c): c is ApiNavigationNode & { title: string } => {
          return "children" in c && c.title === "Operations";
        },
      );
      expect(typesGroup).toBeDefined();
      expect(opsGroup).toBeDefined();
    }
  });

  it("overviewGroupsFor returns only items under the specified landing path", async () => {
    const mockPages = [
      {
        path: "/api-reference/schema-a/types/user",
        title: "User",
        body: "User in schema-a",
      },
      {
        path: "/api-reference/schema-a/types/profile",
        title: "Profile",
        body: "Profile in schema-a",
      },
      {
        path: "/api-reference/schema-b/types/user",
        title: "User",
        body: "User in schema-b",
      },
    ];

    mockQueryCollection.mockReturnValue({
      order: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useApiNavigation();
    const groups = result.overviewGroupsFor("/api-reference/schema-a");

    // Should only contain items from schema-a
    const hasSchemaA = groups.some((g) => {
      return "path" in g ? g.path.includes("schema-a") : false;
    });
    const hasSchemaB = groups.some((g) => {
      return "path" in g ? g.path.includes("schema-b") : false;
    });

    expect(hasSchemaA).toBe(true);
    expect(hasSchemaB).toBe(false);
  });

  it("filters out landing docs (paths ending in /generated)", async () => {
    const mockPages = [
      {
        path: "/api-reference/generated",
        title: "Generated Landing",
        body: "This is a generated landing page",
      },
      {
        path: "/api-reference/types/user",
        title: "User",
        body: "User type",
      },
      {
        path: "/api-reference/schema-a/generated",
        title: "Schema-A Landing",
        body: "Schema-A generated landing",
      },
    ];

    mockQueryCollection.mockReturnValue({
      order: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useApiNavigation();
    const sections = result.sections.value;

    // Flatten all paths in the tree
    const getAllPaths = (nodes: ApiNavigationNode[]): string[] => {
      return nodes.flatMap((node) => {
        if ("children" in node) {
          return getAllPaths(node.children);
        }
        return (node as ApiNavigationLeaf).path;
      });
    };

    const allPaths = getAllPaths(sections);

    // Landing docs should not appear in the tree
    expect(allPaths).not.toContain("/api-reference/generated");
    expect(allPaths).not.toContain("/api-reference/schema-a/generated");
    // Regular content should still be there
    expect(allPaths).toContain("/api-reference/types/user");
  });

  it("marks deprecated pages with a badge", async () => {
    const mockPages = [
      {
        path: "/api-reference/types/old-type",
        title: "OldType",
        body: "Deprecated\n\nThis type is no longer supported.",
      },
      {
        path: "/api-reference/types/new-type",
        title: "NewType",
        body: "A new type with no deprecation notice.",
      },
    ];

    mockQueryCollection.mockReturnValue({
      order: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useApiNavigation();
    const sections = result.sections.value;

    // Find leaves in the tree
    const getLeaves = (nodes: ApiNavigationNode[]): ApiNavigationLeaf[] => {
      return nodes.flatMap((node) => {
        if ("children" in node) {
          return getLeaves(node.children);
        }
        return [node as ApiNavigationLeaf];
      });
    };

    const leaves = getLeaves(sections);
    const oldType = leaves.find((l) => {
      return l.path === "/api-reference/types/old-type";
    });
    const newType = leaves.find((l) => {
      return l.path === "/api-reference/types/new-type";
    });

    expect(oldType?.isDeprecated).toBe(true);
    expect(oldType?.badge).toEqual({
      label: "deprecated",
      color: "error",
      variant: "subtle",
    });

    expect(newType?.isDeprecated).toBe(false);
    expect(newType?.badge).toBeUndefined();
  });

  it("falls back to grouping by kind (from meta) when a page has no path segments to group by", async () => {
    const mockPages = [
      {
        path: "/api-reference/user",
        title: "User",
        body: "",
        meta: { kind: "objects" },
      },
      {
        path: "/api-reference/profile",
        title: "Profile",
        body: "",
        meta: { kind: "objects" },
      },
      {
        path: "/api-reference/id",
        title: "ID",
        body: "",
        meta: { kind: "scalars" },
      },
      {
        path: "/api-reference/get-user",
        title: "GetUser",
        body: "",
        meta: { kind: "queries" },
      },
    ];

    mockQueryCollection.mockReturnValue({
      order: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useApiNavigation();
    const sections = result.sections.value;

    const objects = sections.find(
      (s): s is ApiNavigationNode & { title: string } => {
        return "children" in s && s.title === "Objects";
      },
    );
    const scalars = sections.find(
      (s): s is ApiNavigationNode & { title: string } => {
        return "children" in s && s.title === "Scalars";
      },
    );
    const queries = sections.find(
      (s): s is ApiNavigationNode & { title: string } => {
        return "children" in s && s.title === "Queries";
      },
    );

    expect(objects).toBeDefined();
    expect(scalars).toBeDefined();
    expect(queries).toBeDefined();

    if (objects && "children" in objects) {
      expect(objects.children).toHaveLength(2);
      const userLeaf = objects.children.find((c): c is ApiNavigationLeaf => {
        return "path" in c && c.path === "/api-reference/user";
      });
      expect(userLeaf).toBeDefined();
    }
  });

  it("leaves pages ungrouped when neither path segments nor kind are available", async () => {
    const mockPages = [
      { path: "/api-reference/user", title: "User", body: "" },
    ];

    mockQueryCollection.mockReturnValue({
      order: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useApiNavigation();
    const sections = result.sections.value;

    expect(sections).toHaveLength(1);
    expect("path" in sections[0]! && sections[0].path).toBe(
      "/api-reference/user",
    );
  });

  it("sorts branches and leaves alphabetically by title at every level", async () => {
    const mockPages = [
      { path: "/api-reference/types/objects/user", title: "User", body: "" },
      {
        path: "/api-reference/types/objects/profile",
        title: "Profile",
        body: "",
      },
      { path: "/api-reference/types/enums/status", title: "Status", body: "" },
      {
        path: "/api-reference/operations/queries/user",
        title: "GetUser",
        body: "",
      },
      {
        path: "/api-reference/operations/mutations/create-user",
        title: "CreateUser",
        body: "",
      },
    ];

    mockQueryCollection.mockReturnValue({
      order: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useApiNavigation();
    const sections = result.sections.value as (ApiNavigationNode & {
      title: string;
      children: ApiNavigationNode[];
    })[];

    // Top-level branches: "Operations" before "Types" alphabetically.
    expect(
      sections.map((s) => {
        return s.title;
      }),
    ).toEqual(["Operations", "Types"]);

    const operations = sections.find((s) => {
      return s.title === "Operations";
    })!;
    // Its own children (Mutations, Queries) sorted alphabetically too.
    expect(
      operations.children.map((c) => {
        return (c as ApiNavigationNode & { title: string }).title;
      }),
    ).toEqual(["Mutations", "Queries"]);

    const types = sections.find((s) => {
      return s.title === "Types";
    })!;
    expect(
      types.children.map((c) => {
        return (c as ApiNavigationNode & { title: string }).title;
      }),
    ).toEqual(["Enums", "Objects"]);

    const objects = types.children.find(
      (
        c,
      ): c is ApiNavigationNode & {
        title: string;
        children: ApiNavigationLeaf[];
      } => {
        return "children" in c && c.title === "Objects";
      },
    )!;
    // Leaves within a group ("Profile" before "User"), by title, not path/insertion order.
    expect(
      objects.children.map((leaf) => {
        return leaf.title;
      }),
    ).toEqual(["Profile", "User"]);
  });

  it("overviewGroupsFor also falls back to grouping by kind for a flat landing page", async () => {
    const mockPages = [
      {
        path: "/api-reference/user",
        title: "User",
        body: "",
        meta: { kind: "objects" },
      },
      {
        path: "/api-reference/id",
        title: "ID",
        body: "",
        meta: { kind: "scalars" },
      },
    ];

    mockQueryCollection.mockReturnValue({
      order: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useApiNavigation();
    const groups = result.overviewGroupsFor("/api-reference");

    const sectionTitles = groups.map((g) => {
      return (g as { sectionTitle: string }).sectionTitle;
    });
    expect(sectionTitles).toContain("Objects");
    expect(sectionTitles).toContain("Scalars");
  });
});
