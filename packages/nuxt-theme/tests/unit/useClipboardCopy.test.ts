import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const unmountHooks: (() => void)[] = [];

Object.assign(globalThis, {
  ref: (value: unknown) => {
    return { value };
  },
  computed: (getter: () => unknown) => {
    return {
      get value() {
        return getter();
      },
    };
  },
  onUnmounted: (hook: () => void) => {
    unmountHooks.push(hook);
  },
});

const { useClipboardCopy } =
  await import("../../app/composables/useClipboardCopy");

describe("useClipboardCopy", () => {
  const writeText = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    writeText.mockReset();
    vi.stubGlobal("navigator", { clipboard: { writeText } });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("copies and resets the copied state after a delay", async () => {
    writeText.mockResolvedValue(undefined);
    const { copied, copy, copyButtonProps } = useClipboardCopy(() => {
      return "SDL";
    });

    expect(copyButtonProps.value["aria-label"]).toBe("Copy SDL snippet");
    expect(copyButtonProps.value.icon).toBe("i-lucide-copy");

    await copy("type A");
    expect(writeText).toHaveBeenCalledWith("type A");
    expect(copied.value).toBe(true);
    expect(copyButtonProps.value["aria-label"]).toBe("Copied");
    expect(copyButtonProps.value.icon).toBe("i-lucide-check");

    vi.advanceTimersByTime(1500);
    expect(copied.value).toBe(false);
  });

  it("leaves the state unchanged when the clipboard is refused", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    const { copied, copy } = useClipboardCopy(() => {
      return "SDL";
    });

    await copy("x");
    expect(copied.value).toBe(false);
  });

  it("clears the timer on unmount", async () => {
    writeText.mockResolvedValue(undefined);
    const { copied, copy } = useClipboardCopy(() => {
      return "SDL";
    });

    await copy("x");
    for (const hook of unmountHooks) hook();
    vi.advanceTimersByTime(2000);
    expect(copied.value).toBe(true);
  });
});
