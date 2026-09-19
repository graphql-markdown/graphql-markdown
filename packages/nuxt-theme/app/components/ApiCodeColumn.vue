<template>
  <section
    class="space-y-6 bg-default p-8 lg:sticky lg:top-(--ui-header-height) lg:h-[calc(100vh-var(--ui-header-height))] lg:overflow-y-auto lg:px-12 lg:py-16"
  >
    <SchemaCodeCard v-if="definitionCard" v-bind="definitionCard" />

    <!-- An operation documents a request and its response, so the two
         examples read as tabs; a type page has at most one, and keeps a
         plain card. -->
    <ProseCodeGroup v-if="isOperation && exampleCards.length">
      <SchemaCodeCard v-for="card in exampleCards" :key="card.label" v-bind="card" />
    </ProseCodeGroup>
    <template v-else>
      <SchemaCodeCard v-for="card in exampleCards" :key="card.label" v-bind="card" />
    </template>
  </section>
</template>

<script setup lang="ts">
interface CodeCard {
  label: string;
  kind: string;
  code: string;
  html: string;
}

defineProps<{
  definitionCard: CodeCard | undefined;
  exampleCards: CodeCard[];
  isOperation: boolean;
}>();
</script>
