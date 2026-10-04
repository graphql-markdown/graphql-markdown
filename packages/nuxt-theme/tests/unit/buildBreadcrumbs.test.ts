import { describe, it, expect } from "vitest";
import { buildBreadcrumbs } from "../../app/utils/api-document";

describe("buildBreadcrumbs", () => {
  it("links only the root crumb and uses the page title for the leaf", () => {
    expect(
      buildBreadcrumbs(
        ["api-reference", "types", "user"],
        "User",
        "/api-reference",
      ),
    ).toEqual([
      { label: "API Reference", to: "/api-reference" },
      { label: "Types", to: undefined },
      { label: "User", to: undefined },
    ]);
  });

  it("falls back to a title-cased segment without a page title", () => {
    expect(
      buildBreadcrumbs(["api-reference", "create-project"], undefined, "/x")[1],
    ).toEqual({ label: "Create Project", to: undefined });
  });

  it("does not link a lone root crumb", () => {
    expect(buildBreadcrumbs(["api-reference"], "T", "/x")).toEqual([
      { label: "API Reference", to: undefined },
    ]);
  });
});
