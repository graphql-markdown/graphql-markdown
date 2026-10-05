import type { ComputedRef, Ref } from "vue";

/**
 * Copy-to-clipboard state for a code card. `@vueuse/core` is only present as
 * a hoisted dependency of `@nuxt/ui`, so the clipboard call is written
 * against the platform API instead.
 */
export const useClipboardCopy = (
  label: () => string,
): {
  copied: Ref<boolean>;
  copy: (text: string) => Promise<void>;
  copyButtonProps: ComputedRef<Record<string, string>>;
} => {
  const copied = ref(false);
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  const copyLabel = computed(() => {
    return copied.value ? "Copied" : `Copy ${label()} snippet`;
  });

  // `aria-label` (not `ariaLabel`): UButton has no such prop, so this falls
  // through as a raw attribute — Vue does not hyphenate an unrecognized
  // camelCase key for fallthrough attrs, so `ariaLabel` would render as the
  // DOM attribute `arialabel`, which screen readers don't recognize.
  const copyButtonProps = computed<Record<string, string>>(() => {
    return {
      icon: copied.value ? "i-lucide-check" : "i-lucide-copy",
      color: "neutral",
      variant: "ghost",
      size: "xs",
      "aria-label": copyLabel.value,
    };
  });

  const copy = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      copied.value = true;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        copied.value = false;
      }, 1500);
    } catch {
      // Clipboard access needs a secure context; leave the icon unchanged when
      // the browser refuses rather than reporting a copy that did not happen.
      copied.value = false;
    }
  };

  onUnmounted(() => {
    clearTimeout(resetTimer);
  });

  return { copied, copy, copyButtonProps };
};
