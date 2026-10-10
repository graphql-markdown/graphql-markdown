import { describe, it, expect } from "vitest";

import { buildFooterUi } from "../../app/utils/footer-ui";

describe("buildFooterUi", () => {
  it("keeps the default in-flow footer when not sticky", () => {
    expect(buildFooterUi()).toEqual({
      root: "border-t border-default bg-muted",
      container: "py-6",
    });
  });

  it("pins the footer at a fixed height when sticky", () => {
    expect(buildFooterUi({ sticky: true })).toEqual({
      root: "border-t border-default bg-muted sticky bottom-0 z-40",
      container: "h-(--gqlmd-footer-height) py-0",
    });
  });

  it("appends the container class in both modes", () => {
    expect(buildFooterUi({ containerClass: "max-w-none" }).container).toBe(
      "py-6 max-w-none",
    );
    expect(
      buildFooterUi({ sticky: true, containerClass: "max-w-none px-4" })
        .container,
    ).toBe("h-(--gqlmd-footer-height) py-0 max-w-none px-4");
  });
});
