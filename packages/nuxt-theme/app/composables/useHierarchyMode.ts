/**
 * Detects whether the generated API reference content is using
 * `printTypeOptions.hierarchy: "flat"` (see `@graphql-markdown/core`'s
 * `hierarchy` option) — nothing in the generated content or app config says
 * this explicitly, so it's inferred from path shape: under flat hierarchy
 * every non-landing generated page has exactly one path segment past the
 * shared `baseURL` root (no category folders); under `"api"`/`"entity"`
 * hierarchy, pages are nested at least one level deeper.
 *
 * `[...slug].vue` and `reference.vue` both call this to decide whether to
 * show the single-page reference (see `useApiSinglePage.ts`) in place of the
 * per-type catalog — a schema generated with `hierarchy: "api"` or
 * `"entity"` is unaffected either way, since this always resolves `false`
 * for those.
 */
export const useHierarchyMode = async (): Promise<{
  isFlat: ComputedRef<boolean>;
}> => {
  const config = useAppConfig();
  const rootDepth = computed(() => {
    return (config.gqlmd.baseURL as string).split("/").filter(Boolean).length;
  });

  const { data } = await useAsyncData(
    "api-reference-hierarchy-mode",
    async () => {
      const items = await queryCollection("content").select("path").all();
      const nonLanding = items.filter((item) => {
        return !item.path.endsWith("/generated");
      });

      return (
        nonLanding.length > 0 &&
        nonLanding.every((item) => {
          return (
            item.path.split("/").filter(Boolean).length === rootDepth.value + 1
          );
        })
      );
    },
  );

  return {
    isFlat: computed(() => {
      return data.value ?? false;
    }),
  };
};
