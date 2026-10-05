<template>
  <section class="api-single-page-section">
    <h1 :id="bucket.id">{{ bucket.title }}</h1>

    <ApiSinglePageEntry
      v-for="entry in bucket.entries"
      :key="entry.anchorId"
      :entry="entry"
    />
  </section>
</template>

<script setup lang="ts">
import type { ApiSinglePageBucket } from "~/composables/useApiSinglePage";

defineProps<{ bucket: ApiSinglePageBucket }>();
</script>

<style scoped>
.api-single-page-section + .api-single-page-section {
  margin-top: 4rem;
}

.api-single-page-section > h1 {
  font-family: var(--font-serif);
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--ui-text-highlighted);
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--ui-border-accented);
}
</style>
