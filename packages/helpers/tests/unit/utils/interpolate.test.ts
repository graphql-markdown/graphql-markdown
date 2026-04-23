import { getObjPath, interpolate } from "../../../src/utils/interpolate";

describe("interpolate", () => {
  describe("getObjPath()", () => {
    test("returns the nested property value based on string path", () => {
      expect.hasAssertions();

      expect(getObjPath("foo.bar", { foo: { bar: 42 } })).toBe(42);
    });

    test("returns fallback if path is invalid", () => {
      expect.hasAssertions();

      expect(getObjPath("foo.bak", { foo: { bar: 42 } }, "fallback")).toBe(
        "fallback",
      );
    });

    test("returns fallback if obj is not an object", () => {
      expect.hasAssertions();

      expect(getObjPath("foo.bak", undefined, "fallback")).toBe("fallback");
    });

    test("returns fallback if path is not a string", () => {
      expect.hasAssertions();

      expect(getObjPath(undefined, { foo: { bar: 42 } }, "fallback")).toBe(
        "fallback",
      );
    });

    test("returns string of fallback value", () => {
      expect.hasAssertions();

      expect(getObjPath("missing", { foo: "bar" }, 123)).toBe("123");
    });

    test("returns empty string as default fallback", () => {
      expect.hasAssertions();

      expect(getObjPath("missing.path", { foo: "bar" })).toBe("");
    });

    test("handles deeply nested paths", () => {
      expect.hasAssertions();

      expect(getObjPath("a.b.c.d", { a: { b: { c: { d: "deep" } } } })).toBe(
        "deep",
      );
    });

    test("returns fallback for empty object", () => {
      expect.hasAssertions();

      expect(getObjPath("any.path", {}, "empty")).toBe("empty");
    });

    test("returns fallback for null object", () => {
      expect.hasAssertions();

      expect(getObjPath("path", null, "null-fallback")).toBe("null-fallback");
    });
  });

  describe("interpolate()", () => {
    test("returns an interpolated string with replaced values", () => {
      expect.hasAssertions();

      const values = { foo: 42, bar: { value: "test" } };
      const template = "${foo} is not ${bar.value}";

      expect(interpolate(template, values)).toBe("42 is not test");
    });

    test("returns an interpolated string with fallback values when not found", () => {
      expect.hasAssertions();

      const values = { foo: 42, bar: { value: "test" } };
      const template = "${foo} is not ${bar.notfound}";

      expect(interpolate(template, values, "fallback")).toBe(
        "42 is not fallback",
      );
    });

    test("handles multiple interpolations", () => {
      expect.hasAssertions();

      const values = { a: 1, b: 2, c: 3 };
      const template = "${a} + ${b} + ${c}";

      expect(interpolate(template, values)).toBe("1 + 2 + 3");
    });

    test("handles nested path interpolation", () => {
      expect.hasAssertions();

      const values = {
        user: { profile: { name: "Alice", age: 30 } },
      };
      const template = "${user.profile.name} is ${user.profile.age}";

      expect(interpolate(template, values)).toBe("Alice is 30");
    });

    test("uses empty string as default fallback", () => {
      expect.hasAssertions();

      const values = { exists: "yes" };
      const template = "Value: ${missing}";

      expect(interpolate(template, values)).toBe("Value: ");
    });

    test("handles null variables", () => {
      expect.hasAssertions();

      const template = "Value: ${key}";

      expect(interpolate(template, null, "fallback")).toBe("Value: fallback");
    });

    test("preserves non-interpolated text", () => {
      expect.hasAssertions();

      const values = { name: "World" };
      const template = "Hello, ${name}! How are you?";

      expect(interpolate(template, values)).toBe("Hello, World! How are you?");
    });

    test("handles template with no interpolations", () => {
      expect.hasAssertions();

      const values = { unused: "value" };
      const template = "Static text";

      expect(interpolate(template, values)).toBe("Static text");
    });

    test("handles whitespace within interpolation brackets", () => {
      expect.hasAssertions();

      const values = { key: "value" };
      const template = "${ key }";

      expect(interpolate(template, values)).toBe("value");
    });

    test("handles special characters in values", () => {
      expect.hasAssertions();

      const values = { text: "Hello $$ {foo}" };
      const template = "Result: ${text}";

      expect(interpolate(template, values)).toBe("Result: Hello $$ {foo}");
    });
  });
});
