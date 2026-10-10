import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

type Callback = (records: unknown[]) => void;

const mounted: (() => void)[] = [];
const unmounted: (() => void)[] = [];
const watchers: { source: unknown; cb: (value: any) => void }[] = [];
const route = { hash: "" };
const hookRemove = vi.fn();
const hookFn = vi.fn((_name: string, _cb: () => void) => hookRemove);

class FakeObserver {
  static instances: FakeObserver[] = [];
  observed: unknown[] = [];
  disconnected = false;
  constructor(
    public callback: Callback,
    public options: { rootMargin: string },
  ) {
    FakeObserver.instances.push(this);
  }
  observe(element: unknown) {
    this.observed.push(element);
  }
  disconnect() {
    this.disconnected = true;
  }
}

const entry = (id?: string) => {
  return {
    querySelector: () => {
      return id ? { id } : null;
    },
  };
};

let entries: ReturnType<typeof entry>[] = [];
const scrollIntoView = vi.fn();
const replaceState = vi.fn();
const listeners: Record<string, () => void> = {};
let cssHeight = "";
let rootFontSize = "16px";

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
  nextTick: (cb?: () => void) => {
    cb?.();
    return Promise.resolve();
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
  mounted.forEach((hook) => hook());
  return result;
};

const trigger = (records: unknown[]) => {
  const observer = FakeObserver.instances.at(-1)!;
  observer.callback(records);
};

const intersecting = (id?: string) => {
  return { isIntersecting: true, target: entry(id) };
};

describe("useActiveEntry", () => {
  beforeEach(() => {
    mounted.length = 0;
    unmounted.length = 0;
    watchers.length = 0;
    route.hash = "";
    FakeObserver.instances = [];
    entries = [entry("a"), entry("b")];
    cssHeight = "64px";
    rootFontSize = "16px";
    hookFn.mockClear();
    hookRemove.mockClear();
    scrollIntoView.mockClear();
    replaceState.mockClear();
    for (const key of Object.keys(listeners)) delete listeners[key];

    vi.stubGlobal("IntersectionObserver", FakeObserver);
    vi.stubGlobal("getComputedStyle", () => {
      return {
        getPropertyValue: () => {
          return cssHeight;
        },
        fontSize: rootFontSize,
      };
    });
    vi.stubGlobal("history", { state: { s: 1 }, replaceState });
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
        return Object.assign([...entries], {
          item: (index: number) => {
            return entries[index];
          },
        });
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
    const { activeAnchor } = setup();
    expect(activeAnchor.value).toBeUndefined();
  });

  it("observes entries with a rootMargin based on the header height", () => {
    setup();
    const observer = FakeObserver.instances.at(-1)!;
    expect(observer.observed).toHaveLength(2);
    expect(observer.options.rootMargin).toBe("-64px 0px -735px 0px");
  });

  it("converts rem header heights and falls back on invalid values", () => {
    cssHeight = "4rem";
    rootFontSize = "10px";
    setup();
    expect(FakeObserver.instances.at(-1)!.options.rootMargin).toBe(
      "-40px 0px -759px 0px",
    );

    mounted.length = 0;
    cssHeight = "";
    setup();
    expect(FakeObserver.instances.at(-1)!.options.rootMargin).toBe(
      "-64px 0px -735px 0px",
    );
  });

  it("does not observe when disabled", () => {
    setup(false);
    expect(FakeObserver.instances).toHaveLength(0);
  });

  it("activates the intersecting entry and ignores other records", () => {
    const { activeAnchor } = setup();
    trigger([
      { isIntersecting: false, target: entry("x") },
      intersecting(undefined),
      intersecting("a"),
    ]);
    expect(activeAnchor.value).toBe("a");
  });

  it("activates the last entry when scrolled to the bottom", () => {
    const { activeAnchor } = setup();
    Object.assign(window, { scrollY: 4200 });
    trigger([intersecting("a")]);
    expect(activeAnchor.value).toBe("b");
  });

  it("keeps the current anchor when the last entry has no heading", () => {
    entries = [entry("a"), entry()];
    const { activeAnchor } = setup();
    Object.assign(window, { scrollY: 4200 });
    trigger([intersecting("a")]);
    expect(activeAnchor.value).toBe("a");
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

  it("re-observes and scrolls to the hash target on page:finish", () => {
    const { activeAnchor } = setup();
    expect(hookFn).toHaveBeenCalledWith("page:finish", expect.any(Function));
    route.hash = "#b";
    hookFn.mock.calls[0]![1]();
    expect(FakeObserver.instances).toHaveLength(2);
    expect(activeAnchor.value).toBe("b");
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it("only re-observes on page:finish without a hash", () => {
    setup();
    hookFn.mock.calls[0]![1]();
    expect(FakeObserver.instances).toHaveLength(2);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("rebuilds the observer on resize and cleans up on unmount", () => {
    setup();
    listeners.resize!();
    expect(FakeObserver.instances).toHaveLength(2);
    expect(FakeObserver.instances[0]!.disconnected).toBe(true);

    unmounted.forEach((hook) => hook());
    expect(hookRemove).toHaveBeenCalled();
    expect(listeners.resize).toBeUndefined();
    expect(FakeObserver.instances[1]!.disconnected).toBe(true);
  });
});
