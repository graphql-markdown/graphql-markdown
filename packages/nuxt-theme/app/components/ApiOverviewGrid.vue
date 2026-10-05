<template>
  <UPageGrid class="mt-6 gap-2 xl:grid-cols-3">
    <UPageCard
      v-for="item in items"
      :key="itemKey(item)"
      :to="getFirstLeafPath(item)"
      :title="item.title"
      :description="`${countLeaves(item)} ${countLeaves(item) === 1 ? 'entry' : 'entries'}`"
      variant="subtle"
      :ui="{
        container: 'p-3 sm:p-3 gap-y-0',
        title: 'font-serif text-lg',
        description: 'text-xs leading-tight text-muted',
      }"
    >
      <template v-if="'sectionTitle' in item" #leading>
        <p class="font-mono text-[0.6875rem] text-primary">
          {{ item.sectionTitle }}
        </p>
      </template>
    </UPageCard>
  </UPageGrid>
</template>

<script setup lang="ts">
import type { ApiNavigationNode } from "~/composables/useApiNavigation";
import {
  countLeaves,
  getFirstLeafPath,
  itemKey,
} from "~/utils/navigation-tree";

defineProps<{
  items: Array<
    ApiNavigationNode | (ApiNavigationNode & { sectionTitle: string })
  >;
}>();
</script>
