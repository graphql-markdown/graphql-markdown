import { describe, it, expect } from "vitest";
import { referencePageTitle } from "../../app/utils/page-title";

describe("referencePageTitle", () => {
  it("suffixes the landing title with the site title", () => {
    expect(
      referencePageTitle({
        title: "Workspace API",
        siteTitle: "Acme",
        isLanding: true,
      }),
    ).toBe("Workspace API | Acme");
  });

  it("adds API Reference and the site title on other pages", () => {
    expect(
      referencePageTitle({
        title: "User",
        siteTitle: "Acme",
        isLanding: false,
      }),
    ).toBe("User | API Reference | Acme");
  });

  it("drops an empty or undefined site title", () => {
    expect(
      referencePageTitle({ title: "User", siteTitle: "  ", isLanding: false }),
    ).toBe("User | API Reference");
    expect(referencePageTitle({ title: "User", isLanding: true })).toBe("User");
  });

  it("drops a site title equal to the page title", () => {
    expect(
      referencePageTitle({
        title: "Acme",
        siteTitle: " acme ",
        isLanding: true,
      }),
    ).toBe("Acme");
  });
});
