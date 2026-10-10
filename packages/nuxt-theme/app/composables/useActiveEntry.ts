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

  const updateActiveAnchor = (record: IntersectionObserverEntry): void => {
    if (!record.isIntersecting) {
      return;
    }
    const id = record.target.querySelector("h2[id]")?.id;
    if (id) {
      activeAnchor.value = id;
    }
  };

  const activateLastEntryAtBottom = (): void => {
    if (
      window.innerHeight + window.scrollY <
      document.documentElement.scrollHeight
    ) {
      return;
    }
    const entries = document.querySelectorAll(".api-single-page-entry");
    const id = entries
      .item(entries.length - 1)
      ?.querySelector("h2[id]")?.id;
    if (id) {
      activeAnchor.value = id;
    }
  };

  const observe = (): void => {
    disconnect();
    if (!toValue(enabled)) {
      return;
    }

    const header = readHeaderHeight();
    observer = new IntersectionObserver(
      (records) => {
        records.forEach(updateActiveAnchor);
        activateLastEntryAtBottom();
      },
      {
        rootMargin: `-${header}px 0px -${Math.max(window.innerHeight - header - 1, 0)}px 0px`,
      },
    );

    document.querySelectorAll(".api-single-page-entry").forEach((element) => {
      observer?.observe(element);
    });
  };

  /**
   * A link in the content (`<baseURL>/<slug>`) redirects to `<baseURL>#<slug>`,
   * a path change that re-mounts the page — but not this layout-level
   * composable — so the entries observed so far are detached, and the
   * router's own hash scroll ran before the new ones existed. Once the page
   * has rendered, re-observe and scroll the hash target into view (its `h2`
   * carries a `scroll-margin-top` that clears the sticky header).
   */
  const onPageFinish = (): void => {
    void nextTick(() => {
      observe();
      const id = route.hash.replace(/^#/, "");
      if (id && toValue(enabled)) {
        activeAnchor.value = id;
        document.getElementById(id)?.scrollIntoView();
      }
    });
  };

  let removePageFinishHook: (() => void) | undefined;

  onMounted(() => {
    void nextTick(observe);
    removePageFinishHook = useNuxtApp().hook("page:finish", onPageFinish);
    // rootMargin depends on the viewport height, so rebuild on resize.
    window.addEventListener("resize", observe);
  });

  onBeforeUnmount(() => {
    removePageFinishHook?.();
    window.removeEventListener("resize", observe);
    disconnect();
  });

  watch(activeAnchor, (id) => {
    if (import.meta.client && id && toValue(enabled)) {
      history.replaceState(history.state, "", `#${id}`);
    }
  });

  watch(() => route.hash, (hash) => {
    const id = hash.replace(/^#/, "");
    if (id) activeAnchor.value = id;
  });

  return { activeAnchor };
};
