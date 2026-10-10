import { describe, it, expect } from "vitest";
import { isLandingDocPath } from "../../constants";

describe("isLandingDocPath", () => {
  it("is true when the last segment is the landing doc name", () => {
    expect(isLandingDocPath("/api-reference/generated")).toBe(true);
  });

  it("is false for lookalike names", () => {
    expect(isLandingDocPath("/api-reference/generated-things")).toBe(false);
  });

  it("is false for regular entries", () => {
    expect(isLandingDocPath("/api-reference/objects-user")).toBe(false);
  });
});
