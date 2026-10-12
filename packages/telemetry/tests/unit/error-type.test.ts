import { errorTypeOf } from "../../src/error-type";

describe("errorTypeOf", () => {
  test("allowlisted classes are reported", () => {
    expect(errorTypeOf(new Error("x"))).toBe("Error");
    expect(errorTypeOf(new TypeError("x"))).toBe("TypeError");
  });

  test("custom classes are masked", () => {
    class SecretError extends Error {}
    expect(errorTypeOf(new SecretError("x"))).toBe("<custom-error>");
  });

  test("system codes are appended", () => {
    const error = Object.assign(new Error("x"), { code: "ENOENT" });
    expect(errorTypeOf(error)).toBe("Error:ENOENT");
  });

  test("non-system codes are ignored", () => {
    const error = Object.assign(new Error("x"), { code: "my-secret" });
    expect(errorTypeOf(error)).toBe("Error");
  });

  test("non-objects are masked", () => {
    expect(errorTypeOf("boom")).toBe("<custom-error>");
    expect(errorTypeOf(42)).toBe("<custom-error>");
    expect(errorTypeOf(null)).toBe("<custom-error>");
    expect(errorTypeOf(undefined)).toBe("<custom-error>");
  });

  test("never throws", () => {
    const hostile = new Proxy(
      {},
      {
        get: () => {
          throw new Error("trap");
        },
      },
    );
    expect(errorTypeOf(hostile)).toBe("<custom-error>");
  });
});
