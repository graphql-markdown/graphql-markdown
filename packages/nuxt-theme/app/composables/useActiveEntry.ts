/** Fallback sticky header height (px) when `--ui-header-height` is unusable. */
const DEFAULT_HEADER_HEIGHT = 64;

/** Reads the sticky header height from the `--ui-header-height` CSS var,
 * accepting `px` and `rem` values. */
const readHeaderHeight = (): number => {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--ui-header-height")
    .trim();
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) {
    return DEFAULT_HEADER_HEIGHT;
  }
  if (raw.endsWith("rem")) {
    return (
      value *
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  }
  return value;
};

/**
 * Tracks which single-page entry is currently under the sticky header, so the
 * sidebar can highlight it and the URL hash can follow the scroll position.
 *
 * Nuxt UI's `useScrollspy` is deliberately not used: it only tracks headings
 * that are currently visible, so it loses track of the active entry midway
 * through a long entry whose `h2` has already scrolled out of view. Here the
 * observer watches whole `.api-single-page-entry` articles against a 1px
 * trigger line just under the header, so the entry crossing that line stays
 * active for as long as any part of it is there.
 *
 * `history.replaceState` (not `router.replace`) keeps the hash in sync without
 * triggering navigation or a scroll jump; a reload then returns to the same
 * entry.
 */
export const useActiveEntry = (
  enabled: Ref<boolean> | boolean,
): { activeAnchor: Ref<string | undefined> } => {
  const route = useRoute();
  const activeAnchor = ref<string | undefined>(
    route.hash.replace(/^#/, "") || undefined,
  );

  let observer: IntersectionObserver | undefined;

  const disconnect = (): void => {
    observer?.disconnect();
    observer = undefined;
  };

  const observe = (): void => {
    disconnect();
    if (!toValue(enabled)) {
      return;
    }

    const header = readHeaderHeight();
    observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (!record.isIntersecting) {
            continue;
          }
          const id = record.target.querySelector("h2[id]")?.id;
          if (id) {
            activeAnchor.value = id;
          }
        }
      },
      {
        rootMargin: `-${header}px 0px -${Math.max(window.innerHeight - header - 1, 0)}px 0px`,
      },
    );

    document.querySelectorAll(".api-single-page-entry").forEach((element) => {
      observer?.observe(element);
    });
  };

  onMounted(() => {
    void nextTick(observe);
    // rootMargin depends on the viewport height, so rebuild on resize.
    window.addEventListener("resize", observe);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", observe);
    disconnect();
  });

  watch(activeAnchor, (id) => {
    if (import.meta.client && id && toValue(enabled)) {
      history.replaceState(history.state, "", `#${id}`);
    }
  });

  return { activeAnchor };
};
