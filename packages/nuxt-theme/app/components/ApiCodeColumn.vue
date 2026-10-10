<template>
  <section
    class="space-y-6 bg-default p-8 lg:px-12 lg:py-16"
    :class="
      sticky
        ? 'lg:sticky lg:top-(--ui-header-height) lg:h-[calc(100vh-var(--ui-header-height))] lg:overflow-y-auto'
        : ''
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

interface CodeCard {
  label: string;
  kind: string;
  code: string;
  html: string;
}

const props = withDefaults(
  defineProps<{
    definitionCard: CodeCard | undefined;
    exampleCards: CodeCard[];
    /** Pins the column to the viewport as its page scrolls — right for
     * `[...slug].vue`'s one-definition-per-page view, wrong when this column
     * repeats once per entry down a long single-page view (every instance
     * would compete for the same sticky viewport slot). Off there. */
    sticky?: boolean;
  }>(),
  { sticky: true },
);

const cards = computed<CodeCard[]>(() => {
  const allCards: (CodeCard | undefined)[] = [
    props.definitionCard,
    ...props.exampleCards,
  ];
  return allCards.filter((card): card is CodeCard => Boolean(card));
});
</script>
