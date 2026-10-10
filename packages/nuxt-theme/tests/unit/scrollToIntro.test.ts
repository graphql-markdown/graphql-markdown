import { describe, it, expect, vi } from "vitest";
import { scrollToIntro } from "../../app/utils/scroll-to-intro";

describe("scrollToIntro", () => {
  it("scrolls to the top when already on the base route", () => {
    const scroll = vi.fn();

    expect(scrollToIntro("/api-reference", "/api-reference", scroll)).toBe(
      true,
    );
    expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("ignores a trailing slash on the current path", () => {
    const scroll = vi.fn();

    expect(scrollToIntro("/api-reference/", "/api-reference", scroll)).toBe(
      true,
    );
    expect(scroll).toHaveBeenCalledTimes(1);
  });

  it("does nothing on another route", () => {
    const scroll = vi.fn();

    expect(
      scrollToIntro(
        "/api-reference/types/objects/user",
        "/api-reference",
        scroll,
      ),
    ).toBe(false);
    expect(scroll).not.toHaveBeenCalled();
  });

  it("defaults to window.scrollTo", () => {
    const scrollTo = vi.fn();
    vi.stubGlobal("window", { scrollTo });

    scrollToIntro("/api-reference", "/api-reference");

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    vi.unstubAllGlobals();
  });
});
