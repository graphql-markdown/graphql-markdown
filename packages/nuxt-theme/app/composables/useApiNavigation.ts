import { findDeprecationNotice, titleCase } from "~/utils/api-document";

export interface ApiNavigationLeaf {
  title: string;
  path: string;
  isDeprecated: boolean;
  ui?: Record<string, unknown>;
  badge?: { label: string; color: "error"; variant: "subtle" };
}

export interface ApiNavigationBranch {
  title: string;
  children: ApiNavigationNode[];
}

export type ApiNavigationNode = ApiNavigationBranch | ApiNavigationLeaf;

interface RawPage {
  path: string;
  title: string;
  isDeprecated: boolean;
  /** The GraphQL entity kind (`objects`, `scalars`, `queries`, …) stamped by `formatter.mjs`'s `formatMDXFrontmatter`. */
  kind?: string;
}

/** True for a namespace/schema's own generated landing doc, never a real nav entry. */
const isLandingDoc = (path: string): boolean => {
  return path.endsWith("/generated");
};

interface Branch {
  children: Map<string, Branch>;
  leaves: ApiNavigationLeaf[];
}

/**
 * Groups `items` into a tree keyed by their path segments, skipping the
 * leading `rootDepth` segments (the shared baseURL prefix, e.g.
 * "api-reference" -\> 1 segment) and the item's own trailing slug segment
 * (its leaf identity, not a category). Works for any remaining depth: 0
 * extra segments (a page directly under the root) up to arbitrarily many
 * (multi-schema namespaces stacked above section/group). This is the fix
 * for the old hardcoded-exactly-2-levels behavior.
 */
const buildTree = (
  items: RawPage[],
  rootDepth: number,
): ApiNavigationNode[] => {
  const root: Branch = { children: new Map(), leaves: [] };

  for (const item of items) {
    const segments = item.path.split("/").filter(Boolean);
    const pathCategory = segments.slice(rootDepth, -1);
    // Falls back to the page's `kind` frontmatter (see RawPage) when there
    // are no folder segments left to group by — i.e. `hierarchy: "flat"`,
    // which otherwise has nothing else to group the sidebar/landing grid on.
    let categoryPath: string[] = pathCategory;
    if (pathCategory.length === 0) {
      categoryPath = item.kind ? [item.kind] : [];
    }
    let node = root;
    for (const segment of categoryPath) {
      let child = node.children.get(segment);
      if (!child) {
        child = { children: new Map(), leaves: [] };
        node.children.set(segment, child);
      }
      node = child;
    }
    node.leaves.push({
      title: item.title,
      path: item.path,
      isDeprecated: item.isDeprecated,
      ui: { linkTitle: "font-mono text-[small]" },
      badge: item.isDeprecated
        ? {
            label: "deprecated",
            color: "error" as const,
            variant: "subtle" as const,
          }
        : undefined,
    });
  }

  const byTitle = <T extends { title: string }>(a: T, b: T): number => {
    return a.title.localeCompare(b.title);
  };

  const toNodes = (branch: Branch): ApiNavigationNode[] => {
    return [
      ...[...branch.children.entries()]
        .map(([name, child]) => {
          return {
            title: titleCase(name),
            children: toNodes(child),
          };
        })
        .sort(byTitle),
      ...[...branch.leaves].sort(byTitle),
    ];
  };

  return toNodes(root);
};

/**
 * The navigation tree, derived from the content paths themselves and however
 * many path segments each page actually has after the shared `baseURL`
 * prefix (`app.config.ts`'s `gqlmd.baseURL`) — no assumption about exact
 * depth, so it serves both the default single-schema case (section/group
 * levels) and multi-schema setups (an extra namespace level above
 * section/group) with the same code.
 *
 * The shape is the one `UContentNavigation` and `UContentSearch` both
 * expect — nodes with a `title` and either `children` or a `path` — so the
 * sidebar and the search palette read the same tree.
 */
export const useApiNavigation = async (): Promise<{
  sections: ComputedRef<ApiNavigationNode[]>;
  overviewGroupsFor: (landingPath: string) => (ApiNavigationNode & {
    sectionTitle: string;
  })[];
}> => {
  // Read app config BEFORE the first `await` below. Nuxt's async-instance
  // context (how `useAppConfig`/`useAsyncData`/etc. find "the current app"
  // at all) only survives automatically across `<script setup>`'s own
  // compiler-injected `await`s — a nested async function's OWN internal
  // await does not get that same restoration, so any Nuxt-instance-dependent
  // composable called after `await useAsyncData(...)` below throws
  // NUXT_E1001 ("called outside of a plugin, Nuxt hook, Nuxt middleware, or
  // Vue setup function") — confirmed by actually reproducing it against a
  // real dev server and reading the thrown error's stack trace, not assumed.
  const config = useAppConfig();
  const rootDepth = computed(() => {
    return (config.gqlmd.baseURL as string).split("/").filter(Boolean).length;
  });

  const { data: pages } = await useAsyncData(
    "api-reference-navigation",
    async () => {
      return queryCollection("content")
        .order("path", "ASC")
        .select("path", "title", "body", "meta")
        .all()
        .then((items) => {
          return items
            .filter((item) => {
              return !isLandingDoc(item.path);
            })
            .map<RawPage>((item) => {
              return {
                path: item.path,
                title: item.title,
                isDeprecated: Boolean(findDeprecationNotice(item.body)),
                // `kind` (see RawPage) is undeclared custom frontmatter, so
                // Nuxt Content surfaces it under `meta`, not as a top-level field.
                // Nuxt Content's generated query type claims `meta` is always
                // present, but real content items (and this file's own test
                // mocks) can omit it — the optional chain here is load-bearing.
                kind:
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  typeof item.meta?.kind === "string"
                    ? item.meta.kind
                    : undefined,
              };
            });
        });
    },
  );

  const sections = computed(() => {
    return buildTree(pages.value ?? [], rootDepth.value);
  });

  /**
   * Card-grid data for a landing page at `landingPath` (e.g. `/api-reference`
   * or, for a multi-schema namespace, `/api-reference/schema-a`). Scopes to
   * that landing page's own subtree and flattens exactly one extra level
   * (its direct branch children) into `{ ...leaf-or-branch, sectionTitle }`
   * pairs for the 2-tier card layout — a fixed "take 2 levels for the card
   * grid" projection, independent of how deep the underlying tree actually
   * goes below that.
   */
  const overviewGroupsFor = (
    landingPath: string,
  ): (ApiNavigationNode & { sectionTitle: string })[] => {
    const scopeDepth = landingPath.split("/").filter(Boolean).length;
    const prefix = landingPath.replace(/\/$/, "") + "/";
    const scoped = (pages.value ?? []).filter((item) => {
      return item.path.startsWith(prefix);
    });
    const scopedTree = buildTree(scoped, scopeDepth);

    return scopedTree.flatMap((node) => {
      return "children" in node
        ? node.children.map((item) => {
            return { ...item, sectionTitle: node.title };
          })
        : [];
    });
  };

  return { sections, overviewGroupsFor };
};

/** The absolute path for the shared `gqlmd.baseURL` prefix (e.g. `/api-reference`), used by every file that needs to link to or detect the reference root. */
export const useApiBaseURL = (): ComputedRef<string> => {
  const config = useAppConfig();
  return computed(() => {
    return `/${config.gqlmd.baseURL}`;
  });
};
