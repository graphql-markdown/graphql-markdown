import { codeToHtml } from "shiki";
import {
  CODE_COLUMN_SECTIONS,
  codeColumnNodeIndexes,
  definitionCode,
  findDeprecationNotice,
  isOperationCategory,
  schemaKindLabel,
  sectionCode,
  splitDocumentSections,
  toRenderableNode,
  withoutDeprecationNotice,
} from "~/utils/api-document";
import type { MdcNode } from "~/utils/mdc";
import { detectLanguage } from "./useApiCodeCards";
import type {
  ApiNavigationBranch,
  ApiNavigationLeaf,
  ApiNavigationNode,
} from "./useApiNavigation";

/** True for a namespace/schema's own generated landing doc, never a real entry. */
const isLandingDoc = (path: string): boolean => {
  return path.endsWith("/generated");
};

/** Anvil's own order: queries, then mutations, then subscriptions, then types. */
const OPERATION_KINDS = ["queries", "mutations", "subscriptions"] as const;
type OperationKind = (typeof OPERATION_KINDS)[number];
type BucketId = OperationKind | "types";

interface CodeCard {
  label: string;
  kind: string;
  code: string;
  html: string;
}

/**
 * One entry of the single-page view. Typed by the swizzlable
 * `ApiSinglePageEntry.vue` component, whose import knip can't see.
 *
 * @public
 */
export interface ApiSinglePageEntry {
  anchorId: string;
  title: string;
  kindLabel: string;
  isDeprecated: boolean;
  deprecationReason?: string;
  lead?: Record<string, any>;
  sections: { id: string; title: string; document: Record<string, any> }[];
  definitionCard?: CodeCard;
  exampleCards: CodeCard[];
}

export interface ApiSinglePageBucket {
  id: BucketId;
  title: string;
  entries: ApiSinglePageEntry[];
}

interface RawPage {
  path: string;
  title: string;
  /** Undeclared custom frontmatter, stamped by `formatter.mjs`; Nuxt Content
   * surfaces it under `meta`, not as a top-level field. */
  kind?: string;
  body: { [key: string]: unknown; value: MdcNode[] };
}

/**
 * A GraphQL type and an operation can share a name (a `user` query and a
 * `User` object type both exist in the same schema) — `@graphql-markdown/core`'s
 * flat-hierarchy renderer (`renderTypeEntities`) already resolves that by
 * prefixing the generated *filename* itself with the entity kind
 * (`objects-user.mdx` vs `queries-user.mdx`), so the page's own trailing path
 * segment is already unique by the time it reaches here — this just reads it
 * back verbatim rather than adding a second prefix on top of one that's
 * already there. Exported so `[...slug].vue` can redirect an old per-type
 * route to the exact same anchor this composable gives that page's entry on
 * the single-page view — one source of truth, so the two can't drift apart.
 */
export const anchorIdFor = (page: { path: string; kind?: string }): string => {
  return page.path.split("/").findLast(Boolean) ?? page.path;
};

const bucketIdFor = (kind: string | undefined): BucketId => {
  return kind && (OPERATION_KINDS as readonly string[]).includes(kind)
    ? (kind as OperationKind)
    : "types";
};

const BUCKET_TITLES: Record<BucketId, string> = {
  queries: "Queries",
  mutations: "Mutations",
  subscriptions: "Subscriptions",
  types: "Types",
};

/** Highlights every card a single page carries, dropping any it has no
 * snippet for — mirrors `useApiCodeCards`'s own `toCards`, one page at a
 * time, so per-page work can run in parallel across the whole schema. */
const highlightCards = async (
  requests: { label: string; kind: string; code?: string }[],
  shikiTheme: string,
): Promise<CodeCard[]> => {
  return Promise.all(
    requests
      .filter((request): request is typeof request & { code: string } => {
        return Boolean(request.code);
      })
      .map(async (request) => {
        return {
          ...request,
          html: await codeToHtml(request.code, {
            lang: detectLanguage(request.code),
            theme: shikiTheme,
          }),
        };
      }),
  );
};

const buildEntry = async (
  page: RawPage,
  shikiTheme: string,
): Promise<ApiSinglePageEntry> => {
  const documentBody = page.body.value;
  const deprecationReason = findDeprecationNotice(page.body);
  const inCodeColumn = codeColumnNodeIndexes(documentBody);
  const documentNodes = withoutDeprecationNotice(
    documentBody.filter((_, index) => {
      return !inCodeColumn.has(index);
    }),
    deprecationReason,
  ).map(toRenderableNode);

  const { lead, sections } = splitDocumentSections(documentNodes);
  const asDocument = (nodes: MdcNode[]): RawPage => {
    return { ...page, body: { ...page.body, value: nodes } };
  };

  const isOperation = isOperationCategory(page.kind);
  const kindLabel = schemaKindLabel(page.kind);
  const filteredSections = CODE_COLUMN_SECTIONS.filter((section) => {
    return !section.operationOnly || isOperation;
  });

  const [definitionCard, exampleCards] = await Promise.all([
    highlightCards(
      [{ label: "SDL", kind: kindLabel, code: definitionCode(documentBody) }],
      shikiTheme,
    ),
    highlightCards(
      filteredSections.map(({ title, label, kind }) => {
        return {
          label: label ?? title,
          kind: kind ?? kindLabel,
          code: sectionCode(documentBody, title),
        };
      }),
      shikiTheme,
    ),
  ]);

  return {
    anchorId: anchorIdFor(page),
    title: page.title,
    kindLabel,
    isDeprecated: Boolean(deprecationReason),
    deprecationReason,
    lead: lead.length ? asDocument(lead) : undefined,
    sections: sections.map(({ nodes, ...section }) => {
      return { ...section, document: asDocument(nodes) };
    }),
    definitionCard: definitionCard[0],
    exampleCards,
  };
};

/**
 * Everything the single-page reference view needs: every generated page's
 * full body, fixed up and split into lead/sections the same way
 * `useApiDocument` does for one page at a time, grouped into
 * Queries/Mutations/Subscriptions/Types buckets in Anvil's order, with every
 * definition and example already Shiki-highlighted. Rendered at the base
 * route (`[...slug].vue`'s landing branch) whenever `useHierarchyMode()`
 * detects flat hierarchy, in place of the per-type catalog.
 *
 * Deliberately independent of `useApiNavigation.ts` (which drives the
 * existing per-page sidebar/search): it groups by folder-path segments with a
 * `kind`-based fallback for flat hierarchy, whereas this always groups by the
 * `kind` frontmatter directly, so it groups correctly under `hierarchy: "api" | "entity" | "flat"`
 * alike, with a single code path.
 *
 * Not built to scale indefinitely: every entry's definition/examples are
 * Shiki-highlighted up front (one build-time cost, parallelized across
 * entries) and every entry hydrates its own copy-button state, so a schema
 * with hundreds of types renders as hundreds of small interactive islands on
 * one page. Consumers with very large schemas should prefer `"api"`/`"entity"`
 * hierarchy over `"flat"`.
 */
export const useApiSinglePage = async (
  enabled = true,
): Promise<{
  buckets: ComputedRef<ApiSinglePageBucket[]>;
}> => {
  const config = useAppConfig();
  const shikiTheme = config.gqlmd.shikiTheme;

  // The whole fetch-and-build pipeline runs inside `useAsyncData`'s own
  // handler (not just the raw query) so `[...slug].vue` and `reference.vue`
  // — which both call this composable under flat hierarchy — share one
  // cached result under this key instead of each redoing the Shiki
  // highlighting pass.
  // When `enabled` is false (non-flat hierarchy) the handler returns empty
  // buckets without querying or highlighting, under a distinct key.
  const { data: buckets } = await useAsyncData(
    enabled
      ? "api-reference-single-page"
      : "api-reference-single-page-disabled",
    async (): Promise<ApiSinglePageBucket[]> => {
      if (!enabled) {
        return [];
      }

      const items = await queryCollection("content")
        .order("path", "ASC")
        .select("path", "title", "body", "meta")
        .all();

      const rawPages = items
        .filter((item) => {
          return !isLandingDoc(item.path);
        })
        .map<RawPage>((item) => {
          return {
            path: item.path,
            title: item.title,
            // Nuxt Content's generated query type claims `meta` is always
            // present, but real content items can omit it — this optional
            // chain is load-bearing (see the same pattern and rationale in
            // `useApiNavigation.ts`).
            kind:
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              typeof item.meta?.kind === "string" ? item.meta.kind : undefined,
            // Nuxt Content's generated `MarkdownRoot` type has no index signature,
            // so it doesn't structurally satisfy `RawPage["body"]` even though its
            // `value: MdcNode[]` shape matches at runtime — same as every other
            // composable in this app that touches a content body (see
            // `useApiDocument.ts`, which sidesteps this by typing `page` loosely).
            body: item.body as unknown as RawPage["body"],
          };
        });

      const entries = await Promise.all(
        rawPages.map(async (page) => {
          return buildEntry(page, shikiTheme);
        }),
      );

      return (["queries", "mutations", "subscriptions", "types"] as const)
        .map((id) => {
          return {
            id,
            title: BUCKET_TITLES[id],
            entries: entries
              .filter((_, index) => {
                return bucketIdFor(rawPages[index]!.kind) === id;
              })
              .sort((a, b) => {
                return a.title.localeCompare(b.title);
              }),
          };
        })
        .filter((bucket) => {
          return bucket.entries.length > 0;
        });
    },
  );

  return {
    buckets: computed(() => {
      return buckets.value ?? [];
    }),
  };
};

/**
 * The `useApiNavigation`-shaped anchor tree for the single-page view's own
 * sidebar: same `ApiNavigationNode` type, but every leaf's `path` is an
 * in-page hash (`#<anchorId>`) instead of a route — `UContentNavigation`'s
 * link already treats a hash-only `to` as an in-page scroll, so no custom
 * click handling is needed.
 */
export const useApiSinglePageNavigation = (
  buckets: ApiSinglePageBucket[],
): ApiNavigationNode[] => {
  return buckets.map((bucket): ApiNavigationBranch => {
    return {
      title: bucket.title,
      children: bucket.entries.map((entry): ApiNavigationLeaf => {
        return {
          title: entry.title,
          path: `#${entry.anchorId}`,
          isDeprecated: entry.isDeprecated,
          ui: { linkTitle: "font-mono text-[small]" },
          badge: entry.isDeprecated
            ? {
                label: "deprecated",
                color: "error" as const,
                variant: "subtle" as const,
              }
            : undefined,
        };
      }),
    };
  });
};
