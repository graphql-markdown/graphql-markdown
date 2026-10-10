<template>
  <section
    :class="
      variant === 'entry'
        ? 'space-y-6 bg-default pt-6 lg:pt-0 lg:pl-8 self-start *:first:mt-0 lg:sticky lg:top-[calc(var(--ui-header-height)+1.5rem)] lg:max-h-[calc(100vh-var(--ui-header-height)-3rem)] lg:overflow-y-auto'
        : 'space-y-6 bg-default p-8 lg:px-12 lg:py-16 lg:sticky lg:top-(--ui-header-height) lg:h-[calc(100vh-var(--ui-header-height))] lg:overflow-y-auto'
    "
  >
    <!-- Even a lone SDL card goes through the code group so every type gets
         the same tab-bar frame, keeping the code box identical across types. -->
    <ProseCodeGroup v-if="cards.length">
      <SchemaCodeCard v-for="card in cards" :key="card.label" v-bind="card" />
    </ProseCodeGroup>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { CodeCard } from "~/composables/useApiCodeCards";

const props = withDefaults(
  defineProps<{
    definitionCard: CodeCard | undefined;
    exampleCards: CodeCard[];
    /** "page" pins the column to the viewport for `[...slug].vue`'s
     * one-definition-per-page view. "entry" is for the single-page view, where
     * it sticks inside its own `<article>` grid cell — a sticky element's
     * containing block is its parent, so each entry's box only sticks while
     * that entry is on screen and hands off to the next, with no competition
     * for one viewport slot. It starts level with the entry title (no top
     * padding on lg). */
    variant?: "entry" | "page";
  }>(),
  { variant: "page" },
);

const cards = computed<CodeCard[]>(() => {
  const allCards: (CodeCard | undefined)[] = [
    props.definitionCard,
    ...props.exampleCards,
  ];
  return allCards.filter((card): card is CodeCard => Boolean(card));
});
</script>
