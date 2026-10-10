<template>
  <UFooter :ui="footerUi">
    <ULink
      to="https://graphql-markdown.dev/"
      target="_blank"
      class="text-sm text-dimmed transition hover:text-primary"
    >
      Built with GraphQL-Markdown
    </ULink>
  </UFooter>
</template>

<script setup lang="ts">
// The reference layout pins the footer like the header and makes it full-bleed
// so it spans under the fixed sidebar; the landing page keeps the default
// flow footer.
const props = withDefaults(
  defineProps<{ containerClass?: string; sticky?: boolean }>(),
  { containerClass: undefined, sticky: false },
);

const footerUi = computed(() => ({
  root: [
    "border-t border-default bg-muted",
    props.sticky && "sticky bottom-0 z-40",
  ]
    .filter(Boolean)
    .join(" "),
  container: (props.sticky
    ? ["h-(--gqlmd-footer-height) py-0", props.containerClass]
    : ["py-6", props.containerClass]
  )
    .filter(Boolean)
    .join(" "),
}));
</script>
