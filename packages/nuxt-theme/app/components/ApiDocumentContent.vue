<template>
  <ContentRenderer
    v-if="document.lead"
    :value="document.lead"
    class="markdown-text-body markdown-lead"
  />

  <UCollapsible
    v-for="section in document.sections"
    :key="section.id"
    default-open
  >
    <UButton
      :id="section.id"
      :label="section.title"
      :trailing-icon="'i-lucide-chevron-down'"
      color="neutral"
      variant="ghost"
      block
      class="group section-trigger"
      :ui="{
        label: 'font-serif text-2xl font-semibold text-highlighted',
        trailingIcon:
          'size-5 text-dimmed transition-transform duration-200 group-data-[state=open]:rotate-180',
      }"
    />

    <template #content>
      <ContentRenderer :value="section.document" class="markdown-text-body" />
    </template>
  </UCollapsible>
</template>

<script setup lang="ts">
defineProps<{
  document: {
    lead?: Record<string, any>;
    sections: Array<{ id: string; title: string; document: Record<string, any> }>;
  };
}>();
</script>
