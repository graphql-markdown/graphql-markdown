<template>
  <UHeader
    to="/"
    :toggle="false"
    :ui="{ root: 'bg-muted', container: containerClass }"
  >
    <template #left>
      <slot name="leading" />

      <ULink to="/" class="text-2xl font-bold tracking-normal text-highlighted">
        {{ config.gqlmd.siteTitle }}
      </ULink>
    </template>

    <template #right>
      <slot name="right" />

      <UColorModeButton variant="outline" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
// The reference layout is full-bleed so the header lines up with the fixed
// sidebar; the landing page centres its content and passes its own width.
withDefaults(defineProps<{ containerClass?: string }>(), {
  containerClass: "max-w-none px-4 md:px-8",
});

const config = useAppConfig();
</script>
