<template>
  <div
    class="dark overflow-hidden border border-accented bg-accented text-default"
    :class="hideHeader ? 'rounded-b-[10px]' : 'rounded-[10px]'"
  >
    <div
      v-if="!hideHeader"
      class="flex items-center justify-between border-b border-accented px-5 py-4"
    >
      <span class="font-mono text-sm tracking-normal text-muted">{{
        label
      }}</span>

      <div class="flex items-center gap-2">
        <UBadge color="primary" variant="subtle" size="sm">{{ kind }}</UBadge>

        <UButton v-bind="copyButtonProps" @click="copy(code)" />
      </div>
    </div>

    <div class="relative overflow-x-auto p-5 font-mono text-sm">
      <!-- Inside a code group the tab bar carries the label, so the card drops
           its header and the copy button floats over the snippet instead. -->
      <UButton
        v-if="hideHeader"
        v-bind="copyButtonProps"
        class="absolute top-3 right-3 z-10"
        @click="copy(code)"
      />

      <div class="blueprint-code" v-html="html" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** Caption shown on the left of the card header, and the code-group tab label. */
  label: string;
  /** Schema kind rendered as a badge, e.g. `QUERY` or `ENUM`. */
  kind: string;
  /** Snippet already highlighted by Shiki. */
  html: string;
  /** Plain-text source behind `html`, used for copy-to-clipboard. */
  code: string;
  /** Set by `ProseCodeGroup` on its children; drops the card's own header. */
  hideHeader?: boolean;
}>();

const { copy, copyButtonProps } = useClipboardCopy(() => props.label);
</script>

<style>
/* Shiki emits its own background and spacing; the card supplies both. The
   selectors reach into `v-html` output, so they cannot be scoped. */
/* fallow-ignore-next-line css-selector-complexity -- overrides Shiki inline styles */
.blueprint-code pre {
  background: transparent !important;
  color: var(--gqlmd-code-text) !important;
  line-height: normal;
  margin: 0;
  padding: 0;
}

.blueprint-code code {
  line-height: 0.4rem;
}
</style>
