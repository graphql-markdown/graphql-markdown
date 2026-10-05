<template>
  <div class="flex min-h-screen flex-col bg-default font-sans text-default">
    <SiteHeader>
      <template #leading>
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          class="lg:hidden"
          aria-label="Open navigation"
          @click="isSidebarOpen = true"
        />
      </template>

      <template #right>
        <UContentSearchButton />

        <UButton
          v-if="config.gqlmd.githubUrl"
          :to="config.gqlmd.githubUrl"
          target="_blank"
          icon="i-lucide-github"
          color="neutral"
          variant="outline"
          aria-label="Repository on GitHub"
          title="Repository on GitHub"
        />
      </template>
    </SiteHeader>

    <div class="relative flex w-full flex-1">
      <USidebar
        v-model:open="isSidebarOpen"
        collapsible="offcanvas"
        mode="slideover"
        title="GraphQL API"
        :ui="{
          container:
            'top-(--ui-header-height) h-[calc(100vh-var(--ui-header-height))] border-r border-default bg-muted',
          header: 'px-8',
          body: 'p-8 pt-4',
        }"
        class="[--sidebar-width:var(--gqlmd-sidebar-width)]"
      >
        <template #header>
          <NuxtLink
            :to="baseURLPath"
            class="block text-sm font-semibold text-dimmed transition hover:text-primary"
          >
            GraphQL API
          </NuxtLink>
        </template>

        <UContentNavigation
          class="gqlmd-api-nav"
          :navigation="navigationSections as unknown as ContentNavigationItem[]"
          default-open
          :ui="{ link: 'text-sm', trigger: 'font-normal' }"
        />
      </USidebar>

      <slot />
    </div>

    <SiteFooter />

    <ClientOnly>
      <!-- Nuxt UI reads the dialog's accessible name from `contentSearch.title`
           and `contentSearch.description`, which its bundled locales do not
           define — without these props the modal announces the raw keys. -->
      <UContentSearch
        :navigation="navigationSections as unknown as ContentNavigationItem[]"
        :files="searchFiles ?? []"
        title="Search the API reference"
        description="Find an operation, type, field, or example by name."
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import { useApiSinglePageNavigation } from "~/composables/useApiSinglePage";

const config = useAppConfig();
const baseURLPath = useApiBaseURL();
const isSidebarOpen = ref(true);

// @nuxt/content's ContentNavigationItem requires a `path` on every node,
// including branches — real Nuxt Content trees always have one (folder index
// pages). This layer's own ApiNavigationBranch is a synthetic category
// grouping with no backing page, so it deliberately omits `path`; the two
// components below only ever read `title`/`children`/a leaf's own `path`, so
// the cast at each binding is safe in practice even though the type doesn't
// structurally match. UContentNavigation's `navigation` prop actually wants
// the stricter ContentNavigationLink (which extends this with only optional
// fields), so the same cast satisfies it too.
const { isFlat } = await useHierarchyMode();
const { buckets } = await useApiSinglePage(isFlat.value);
const { sections } = await useApiNavigation();

const navigationSections = computed(() =>
  isFlat.value ? useApiSinglePageNavigation(buckets.value) : sections.value,
);

const { data: searchFiles } = await useAsyncData("api-reference-search", () =>
  queryCollectionSearchSections("content"),
);
</script>

<style scoped>
/* Top-level section headers */
/* fallow-ignore-next-line css-selector-complexity -- Nuxt UI navigation slots have no class hooks */
.gqlmd-api-nav > ul > li[data-slot="itemWithChildren"] > button {
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--ui-primary);
}

/* Nested section headers (inside content divs at any depth) */
/* fallow-ignore-next-line css-selector-complexity -- Nuxt UI navigation slots have no class hooks */
.gqlmd-api-nav [data-slot="content"] li[data-slot="itemWithChildren"] > button {
  font-weight: 400;
  font-size: 0.875rem;
  text-transform: none;
}
</style>
