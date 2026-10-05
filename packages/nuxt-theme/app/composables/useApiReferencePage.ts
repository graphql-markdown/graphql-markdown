import type { ComputedRef, Ref } from "vue";
import { anchorIdFor } from "~/composables/useApiSinglePage";

type Page = Record<string, any> | null | undefined;
type Resolved<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>;

export interface ApiReferencePage {
  route: ReturnType<typeof useRoute>;
  baseURLPath: Ref<string>;
  page: Ref<Page>;
  isLandingPage: ComputedRef<boolean>;
  isFlat: Ref<boolean>;
  buckets: Resolved<typeof useApiSinglePage>["buckets"];
  sections: Resolved<typeof useApiNavigation>["sections"];
  overviewGroups: ComputedRef<
    ReturnType<Resolved<typeof useApiNavigation>["overviewGroupsFor"]>
  >;
  breadcrumbs: ComputedRef<ReturnType<typeof buildBreadcrumbs>>;
  deprecationReason: ReturnType<typeof useApiDocument>["deprecationReason"];
  document: ReturnType<typeof useApiDocument>["document"];
  definitionCard: Resolved<typeof useApiCodeCards>["definitionCard"];
  exampleCards: Resolved<typeof useApiCodeCards>["exampleCards"];
}

/**
 * Everything the catch-all API reference page binds to: the queried content
 * page, its derived schema kind, navigation, code-column cards, the flat-mode
 * redirect and SEO metadata. Kept out of `[...slug].vue` so the page stays a
 * thin template.
 */
export const useApiReferencePage = async (): Promise<ApiReferencePage> => {
  // Unlike `<script setup>`, a plain composable gets no compiler-inserted
  // context restoration after an `await`, so Nuxt-context composables called
  // past the first one must be wrapped (otherwise: NUXT_E1001).
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const config = useAppConfig();
  const baseURLPath = useApiBaseURL();

  const pathSegments = computed(() => {
    return route.path.split("/").filter(Boolean);
  });

  /** `/api-reference/types/objects/user` → `OBJECT`, for the code-column badge. */
  const schemaKind = computed(() => {
    return schemaKindLabel(pathSegments.value.at(-2));
  });

  const isOperation = computed(() => {
    return isOperationCategory(pathSegments.value.at(-2));
  });

  const { data } = await useAsyncData(route.path, async () => {
    const exact = await queryCollection("content").path(route.path).first();
    if (exact) return exact;
    return queryCollection("content")
      .path(`${route.path.replace(/\/$/, "")}/generated`)
      .first();
  });

  const page = data as Ref<Page>;

  const isLandingPage = computed(() => {
    return page.value?.path?.endsWith("/generated") ?? false;
  });

  const { sections, overviewGroupsFor } = await nuxtApp.runWithContext(
    async () => {
      return useApiNavigation();
    },
  );
  const { isFlat } = await nuxtApp.runWithContext(async () => {
    return useHierarchyMode();
  });
  const { buckets } = await nuxtApp.runWithContext(async () => {
    return useApiSinglePage(isFlat.value);
  });
  const overviewGroups = computed(() => {
    return isLandingPage.value ? overviewGroupsFor(route.path) : [];
  });

  if (isFlat.value && page.value && !isLandingPage.value) {
    const anchorId = anchorIdFor({
      path: page.value.path,
      kind:
        typeof page.value.meta?.kind === "string"
          ? page.value.meta.kind
          : undefined,
    });
    await nuxtApp.runWithContext(async () => {
      return navigateTo(`${baseURLPath.value}#${anchorId}`, {
        redirectCode: 301,
      });
    });
  }

  const breadcrumbs = computed(() => {
    return buildBreadcrumbs(
      pathSegments.value,
      // Empty titles fall back to the path-derived label, hence `||`.
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      page.value?.title || undefined,
      baseURLPath.value,
    );
  });

  const { documentBody, deprecationReason, document } = useApiDocument(page);

  const { definitionCard, exampleCards } = await useApiCodeCards(
    documentBody,
    schemaKind,
    isOperation,
    config.gqlmd.shikiTheme,
  );

  if (page.value) {
    const current = page.value;
    await nuxtApp.runWithContext(() => {
      useSeoMeta({
        title: isLandingPage.value
          ? current.title
          : `API Reference | ${current.title}`,
        description: current.description,
      });
    });
  }

  return {
    route,
    baseURLPath,
    page,
    isLandingPage,
    isFlat,
    buckets,
    sections,
    overviewGroups,
    breadcrumbs,
    deprecationReason,
    document,
    definitionCard,
    exampleCards,
  };
};
