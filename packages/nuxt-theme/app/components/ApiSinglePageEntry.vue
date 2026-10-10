<template>
  <article class="api-single-page-entry grid grid-cols-1 lg:grid-cols-2">
    <section class="border-r-0 pr-0 lg:border-r lg:border-default lg:pr-8">
      <h2 :id="entry.anchorId" class="flex items-center gap-3">
        {{ entry.title }}
        <UBadge color="primary" variant="subtle" size="sm" class="font-mono">{{
          entry.kindLabel
        }}</UBadge>
      </h2>

      <UAlert
        v-if="entry.isDeprecated"
        color="error"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        :description="entry.deprecationReason"
        class="mb-8"
      />

      <ContentRenderer
        v-if="entry.lead"
        :value="entry.lead"
        class="markdown-text-body markdown-lead"
      />

      <template v-for="section in entry.sections" :key="section.id">
        <h3>{{ section.title }}</h3>
        <ContentRenderer :value="section.document" class="markdown-text-body" />
      </template>
    </section>

    <ApiCodeColumn
      :sticky="false"
      :definition-card="entry.definitionCard"
      :example-cards="entry.exampleCards"
    />
  </article>
</template>

<script setup lang="ts">
import type { ApiSinglePageEntry } from "~/composables/useApiSinglePage";

defineProps<{ entry: ApiSinglePageEntry }>();
</script>

<style scoped>
.api-single-page-entry {
  padding-top: 3rem;
  margin-top: 3rem;
  border-top: 1px solid var(--ui-border-muted);
}

.api-single-page-entry:first-child {
  padding-top: 0;
  margin-top: 0;
  border-top: 0;
}

.api-single-page-entry h2 {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
  margin-bottom: 1.5rem;
  /* Anchor jumps land the title below the sticky header, not under it. */
  scroll-margin-top: calc(var(--ui-header-height) + 1.5rem);
}

.api-single-page-entry h3 {
  font-family: var(--font-mono);
  color: var(--ui-primary);
  font-size: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--ui-border-muted);
}
</style>
