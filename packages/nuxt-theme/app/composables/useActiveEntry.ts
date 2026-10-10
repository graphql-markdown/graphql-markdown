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
 * through a long entry whose `h2` has already scrolled out of view. Here a
 * `requestAnimationFrame`-throttled `scroll` listener picks the entry spanning
 * the line just under the header (or the last entry when scrolled to the
 * bottom), so the entry crossing that line stays active for as long as any
 * part of it is there. When the page is scrolled back above the first entry,
 * the anchor and the URL hash are cleared.
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

  let headerHeight = DEFAULT_HEADER_HEIGHT;
  let frame: number | undefined;

  const update = (): void => {
    frame = undefined;
    if (!toValue(enabled)) {
      return;
    }
    const entries = [...document.querySelectorAll(".api-single-page-entry")];
    if (entries.length === 0) {
      return;
    }

    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 1;
    const target = atBottom
      ? entries.at(-1)
      : entries.find((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= headerHeight && r.bottom > headerHeight;
        });

    if (target) {
      const id = target.querySelector("h2[id]")?.id;
      if (id) {
        activeAnchor.value = id;
      }
      return;
    }

    // No entry spans the line: if the page is above the first entry, we are
    // back on the intro, so nothing should stay highlighted.
    if (entries[0]!.getBoundingClientRect().top > headerHeight) {
      activeAnchor.value = undefined;
      if (location.hash) {
        history.replaceState(
          history.state,
          "",
          location.pathname + location.search,
        );
      }
    }
  };

  const onScroll = (): void => {
    frame ??= requestAnimationFrame(update);
  };

  const onResize = (): void => {
    headerHeight = readHeaderHeight();
    onScroll();
  };

  /**
   * A link in the content (`<baseURL>/<slug>`) redirects to `<baseURL>#<slug>`,
   * a path change that re-mounts the page — but not this layout-level
   * composable — and the router's own hash scroll ran before the new entries
   * existed. Once the page has rendered, re-scan and scroll the hash target
   * into view (its `h2` carries a `scroll-margin-top` that clears the sticky
   * header).
   */
  const onPageFinish = (): void => {
    void nextTick(() => {
      headerHeight = readHeaderHeight();
      const id = route.hash.replace(/^#/, "");
      if (id && toValue(enabled)) {
        activeAnchor.value = id;
        document.getElementById(id)?.scrollIntoView();
      } else {
        update();
      }
    });
  };

  let removePageFinishHook: (() => void) | undefined;

  onMounted(() => {
    headerHeight = readHeaderHeight();
    // With a hash, the router scrolls to the target (firing `scroll`); a scan
    // now would run before that and replace the hash anchor with the top entry.
    if (!route.hash) {
      void nextTick(update);
    }
    removePageFinishHook = useNuxtApp().hook("page:finish", onPageFinish);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    removePageFinishHook?.();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("scroll", onScroll);
    if (frame !== undefined) {
      cancelAnimationFrame(frame);
      frame = undefined;
    }
  });

  watch(activeAnchor, (id) => {
    if (import.meta.client && id && toValue(enabled)) {
      history.replaceState(history.state, "", `#${id}`);
    }
  });

  watch(
    () => {
      return route.hash;
    },
    (hash) => {
      const id = hash.replace(/^#/, "");
      if (id) {
        activeAnchor.value = id;
      }
    },
  );

  return { activeAnchor };
};
