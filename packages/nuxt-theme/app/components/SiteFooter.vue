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
import { buildFooterUi } from "~/utils/footer-ui";

// The reference layout pins the footer like the header and makes it full-bleed
// so it spans under the fixed sidebar; the landing page keeps the default
// flow footer.
const props = withDefaults(
  defineProps<{ containerClass?: string; sticky?: boolean }>(),
  { containerClass: undefined, sticky: false },
);

const footerUi = computed(() =>
  buildFooterUi({
    containerClass: props.containerClass,
    sticky: props.sticky,
  }),
);
</script>
