<template>
  <div>
    <UPageHeader
      headline="GRAPHQL SCHEMA REFERENCE"
      :title="title"
      :description="description"
      :ui="{
        root: 'border-0 pt-0 pb-0',
        headline: 'font-mono font-normal',
        title: 'font-serif text-5xl sm:text-5xl font-semibold',
        description: 'max-w-2xl leading-8',
      }"
    />

    <ApiOverviewGrid :items="items" />
  </div>
</template>

<script setup lang="ts">
import type { ApiNavigationNode } from "~/composables/useApiNavigation";

defineProps<{
  title: string;
  description: string;
  items: Array<ApiNavigationNode | (ApiNavigationNode & { sectionTitle: string })>;
}>();
</script>
