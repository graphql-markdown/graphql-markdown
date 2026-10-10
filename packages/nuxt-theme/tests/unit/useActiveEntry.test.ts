import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mounted: (() => void)[] = [];
const unmounted: (() => void)[] = [];
const watchers: { source: unknown; cb: (value: any) => void }[] = [];
const route = { hash: "" };
const hookRemove = vi.fn();
const hookFn = vi.fn((_name: string, _cb: () => void) => {
  return hookRemove;
});

const entry = (id: string | undefined, top: number, bottom: number) => {
  return {
    querySelector: () => {
      return id ? { id } : null;
    },
    getBoundingClientRect: () => {
      return { top, bottom };
    },
  };
};

let entries: ReturnType<typeof entry>[] = [];
const scrollIntoView = vi.fn();
const replaceState = vi.fn();
const listeners: Record<string, () => void> = {};
let cssHeight = "";
let rootFontSize = "16px";
let frames: (() => void)[] = [];
const requestAnimationFrame = vi.fn((cb: () => void) => {
  return frames.push(cb);
});
const cancelAnimationFrame = vi.fn();
let locationState = { hash: "", pathname: "/api", search: "?q=1" };

Object.assign(globalThis, {
  ref: (value: unknown) => {
    return { value };
  },
  toValue: (value: any) => {
    return value !== null && typeof value === "object" && "value" in value
      ? value.value
      : value;
  },
  useRoute: () => {
    return route;
  },
  useNuxtApp: () => {
    return { hook: hookFn };
  },
  nextTick: async (cb?: () => void) => {
    cb?.();
  },
  onMounted: (cb: () => void) => {
    mounted.push(cb);
  },
  onBeforeUnmount: (cb: () => void) => {
    unmounted.push(cb);
  },
  watch: (source: unknown, cb: (value: any) => void) => {
    watchers.push({ source, cb });
  },
});

const { useActiveEntry } = await import("../../app/composables/useActiveEntry");

const setup = (enabled: unknown = true) => {
  const result = useActiveEntry(enabled as boolean);
  mounted.forEach((hook) => {
    return hook();
  });
  return result;
};

const flushFrame = () => {
  const pending = frames;
  frames = [];
  pending.forEach((cb) => {
    return cb();
  });
};

describe("useActiveEntry", () => {
  beforeEach(() => {
    mounted.length = 0;
    unmounted.length = 0;
    watchers.length = 0;
    frames = [];
    route.hash = "";
    locationState = { hash: "", pathname: "/api", search: "?q=1" };
    // Entry "a" spans 64..1000 and "b" starts below it: the line at 64px is in "a".
    entries = [entry("a", 0, 1000), entry("b", 1000, 2000)];
    cssHeight = "64px";
    rootFontSize = "16px";
    hookFn.mockClear();
    hookRemove.mockClear();
    scrollIntoView.mockClear();
    replaceState.mockClear();
    requestAnimationFrame.mockClear();
    cancelAnimationFrame.mockClear();
    for (const key of Object.keys(listeners)) delete listeners[key];

    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame);
    vi.stubGlobal("getComputedStyle", () => {
      return {
        getPropertyValue: () => {
          return cssHeight;
        },
        fontSize: rootFontSize,
      };
    });
    vi.stubGlobal("history", { state: { s: 1 }, replaceState });
    vi.stubGlobal("location", locationState);
    vi.stubGlobal("window", {
      innerHeight: 800,
      scrollY: 0,
      addEventListener: (name: string, cb: () => void) => {
        listeners[name] = cb;
      },
      removeEventListener: (name: string) => {
        delete listeners[name];
      },
    });
    vi.stubGlobal("document", {
      documentElement: { scrollHeight: 5000 },
      querySelectorAll: () => {
        return [...entries];
      },
      getElementById: (id: string) => {
        return id === "b" ? { scrollIntoView } : null;
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("initialises the active anchor from the route hash", () => {
    route.hash = "#b";
    const { activeAnchor } = setup();
    expect(activeAnchor.value).toBe("b");
  });

  it("starts without an anchor when there is no hash", () => {
    entries = [entry("a", 500, 1000)];
    const { activeAnchor } = setup();
    expect(activeAnchor.value).toBeUndefined();
  });

  it("activates the entry spanning the line under the header on mount", () => {
    const { activeAnchor } = setup();
    expect(activeAnchor.value).toBe("a");
  });

  it("does nothing when disabled or without entries", () => {
    const disabled = setup(false);
    listeners.scroll!();
    flushFrame();
    expect(disabled.activeAnchor.value).toBeUndefined();

    mounted.length = 0;
    entries = [];
    const empty = setup();
    expect(empty.activeAnchor.value).toBeUndefined();
  });

  it("throttles scroll handling to one update per animation frame", () => {
    const { activeAnchor } = setup();
    entries = [entry("a", -1000, 0), entry("b", 0, 1000)];
    listeners.scroll!();
    listeners.scroll!();
    listeners.scroll!();
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(activeAnchor.value).toBe("a");

    flushFrame();
    expect(activeAnchor.value).toBe("b");

    listeners.scroll!();
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
  });

  it("activates the last entry when scrolled to the bottom", () => {
    const { activeAnchor } = setup();
    Object.assign(window, { scrollY: 4200 });
    listeners.scroll!();
    flushFrame();
    expect(activeAnchor.value).toBe("b");
  });

  it("keeps the current anchor when the target has no heading", () => {
    entries = [entry("a", 0, 1000), entry(undefined, 1000, 2000)];
    const { activeAnchor } = setup();
    Object.assign(window, { scrollY: 4200 });
    listeners.scroll!();
    flushFrame();
    expect(activeAnchor.value).toBe("a");
  });

  it("activates the previous entry when scrolling back up", () => {
    entries = [entry("a", -1000, 0), entry("b", 0, 1000)];
    const { activeAnchor } = setup();
    expect(activeAnchor.value).toBe("b");

    entries = [entry("a", -500, 500), entry("b", 500, 1500)];
    listeners.scroll!();
    flushFrame();
    expect(activeAnchor.value).toBe("a");
  });

  it("clears the anchor and hash when above the first entry", () => {
    const { activeAnchor } = setup();
    expect(activeAnchor.value).toBe("a");

    entries = [entry("a", 400, 1400), entry("b", 1400, 2400)];
    locationState.hash = "#a";
    listeners.scroll!();
    flushFrame();
    expect(activeAnchor.value).toBeUndefined();
    expect(replaceState).toHaveBeenCalledWith({ s: 1 }, "", "/api?q=1");
  });

  it("does not rewrite the URL above the first entry without a hash", () => {
    entries = [entry("a", 400, 1400)];
    const { activeAnchor } = setup();
    expect(activeAnchor.value).toBeUndefined();
    expect(replaceState).not.toHaveBeenCalled();
  });

  it("syncs the URL hash when the anchor changes", () => {
    const { activeAnchor } = setup();
    const [anchorWatch] = watchers;
    anchorWatch!.cb(undefined);
    expect(replaceState).not.toHaveBeenCalled();
    activeAnchor.value = "a";
    anchorWatch!.cb("a");
    expect(replaceState).toHaveBeenCalledWith({ s: 1 }, "", "#a");
  });

  it("does not touch the URL when disabled", () => {
    setup(false);
    watchers[0]!.cb("a");
    expect(replaceState).not.toHaveBeenCalled();
  });

  it("follows route hash changes", () => {
    const { activeAnchor } = setup();
    const hashWatch = watchers[1]!;
    hashWatch.cb("#b");
    expect(activeAnchor.value).toBe("b");
    hashWatch.cb("");
    expect(activeAnchor.value).toBe("b");
  });

  it("scrolls to the hash target on page:finish", () => {
    const { activeAnchor } = setup();
    expect(hookFn).toHaveBeenCalledWith("page:finish", expect.any(Function));
    route.hash = "#b";
    hookFn.mock.calls[0]![1]();
    expect(activeAnchor.value).toBe("b");
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it("re-scans entries on page:finish without a hash", () => {
    const { activeAnchor } = setup();
    entries = [entry("c", 0, 1000)];
    hookFn.mock.calls[0]![1]();
    expect(activeAnchor.value).toBe("c");
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("caches the header height and re-reads it on resize only", () => {
    // Entry "a" ends at 80px: it spans a 64px line but not a 100px one.
    entries = [entry("a", -500, 80), entry("b", 80, 1000)];
    const { activeAnchor } = setup();
    expect(activeAnchor.value).toBe("a");

    cssHeight = "100px";
    listeners.scroll!();
    flushFrame();
    expect(activeAnchor.value).toBe("a");

    listeners.resize!();
    flushFrame();
    expect(activeAnchor.value).toBe("b");
  });

  it("converts rem header heights and falls back on invalid values", () => {
    cssHeight = "4rem";
    rootFontSize = "10px";
    // Header is 40px: entry "b" spans the line, entry "a" ends at 50px.
    entries = [entry("a", -500, 30), entry("b", 30, 1000)];
    expect(setup().activeAnchor.value).toBe("b");

    mounted.length = 0;
    cssHeight = "";
    // Fallback is 64px: "a" (ending at 70) now spans the line.
    entries = [entry("a", -500, 70), entry("b", 70, 1000)];
    expect(setup().activeAnchor.value).toBe("a");
  });

  it("removes listeners and cancels a pending frame on unmount", () => {
    setup();
    listeners.scroll!();
    unmounted.forEach((hook) => {
      return hook();
    });
    expect(hookRemove).toHaveBeenCalled();
    expect(listeners.resize).toBeUndefined();
    expect(listeners.scroll).toBeUndefined();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});
