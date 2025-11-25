import {
  hasDescriptor,
  hasTag,
  isSchemaString,
  isSchemaObject,
  isPath,
  isGroupsObject,
  isLoaderString,
  isInvalidFunctionProperty,
} from "../../../src/directives/validation";

describe("directives/validation", () => {
  describe("hasDescriptor()", () => {
    test("returns true for object with descriptor function", () => {
      expect.hasAssertions();

      const config = { descriptor: () => "result" };
      expect(hasDescriptor(config)).toBe(true);
    });

    test("returns false for object without descriptor", () => {
      expect.hasAssertions();

      const config = { tag: () => "result" };
      expect(hasDescriptor(config)).toBe(false);
    });

    test("returns false for object with descriptor that is not a function", () => {
      expect.hasAssertions();

      const config = { descriptor: "not a function" };
      expect(hasDescriptor(config)).toBe(false);
    });

    test("returns false for null", () => {
      expect.hasAssertions();

      expect(hasDescriptor(null)).toBe(false);
    });

    test("returns false for undefined", () => {
      expect.hasAssertions();

      expect(hasDescriptor(undefined)).toBe(false);
    });

    test("returns false for primitive values", () => {
      expect.hasAssertions();

      expect(hasDescriptor("string")).toBe(false);
      expect(hasDescriptor(42)).toBe(false);
      expect(hasDescriptor(true)).toBe(false);
    });

    test("returns false for arrays", () => {
      expect.hasAssertions();

      expect(hasDescriptor([() => "result"])).toBe(false);
    });
  });

  describe("hasTag()", () => {
    test("returns true for object with tag function", () => {
      expect.hasAssertions();

      const config = { tag: () => "result" };
      expect(hasTag(config)).toBe(true);
    });

    test("returns false for object without tag", () => {
      expect.hasAssertions();

      const config = { descriptor: () => "result" };
      expect(hasTag(config)).toBe(false);
    });

    test("returns false for object with tag that is not a function", () => {
      expect.hasAssertions();

      const config = { tag: "not a function" };
      expect(hasTag(config)).toBe(false);
    });

    test("returns false for null", () => {
      expect.hasAssertions();

      expect(hasTag(null)).toBe(false);
    });

    test("returns false for undefined", () => {
      expect.hasAssertions();

      expect(hasTag(undefined)).toBe(false);
    });

    test("returns false for primitive values", () => {
      expect.hasAssertions();

      expect(hasTag("string")).toBe(false);
      expect(hasTag(42)).toBe(false);
      expect(hasTag(true)).toBe(false);
    });

    test("returns false for arrays", () => {
      expect.hasAssertions();

      expect(hasTag([() => "result"])).toBe(false);
    });
  });

  describe("isSchemaString()", () => {
    test("returns true for string", () => {
      expect.hasAssertions();

      expect(isSchemaString("schema.graphql")).toBe(true);
      expect(isSchemaString("")).toBe(true);
      expect(isSchemaString("https://api.example.com/graphql")).toBe(true);
    });

    test("returns false for null", () => {
      expect.hasAssertions();

      expect(isSchemaString(null)).toBe(false);
    });

    test("returns false for undefined", () => {
      expect.hasAssertions();

      expect(isSchemaString(undefined)).toBe(false);
    });

    test("returns false for non-string values", () => {
      expect.hasAssertions();

      expect(isSchemaString(42)).toBe(false);
      expect(isSchemaString(true)).toBe(false);
      expect(isSchemaString({})).toBe(false);
      expect(isSchemaString([])).toBe(false);
    });
  });

  describe("isSchemaObject()", () => {
    test("returns true for object mapping", () => {
      expect.hasAssertions();

      expect(isSchemaObject({ key: "value" })).toBe(true);
      expect(isSchemaObject({})).toBe(true);
      expect(isSchemaObject({ key: { nested: "value" } })).toBe(true);
    });

    test("returns false for null", () => {
      expect.hasAssertions();

      expect(isSchemaObject(null)).toBe(false);
    });

    test("returns false for undefined", () => {
      expect.hasAssertions();

      expect(isSchemaObject(undefined)).toBe(false);
    });

    test("returns false for arrays", () => {
      expect.hasAssertions();

      expect(isSchemaObject([])).toBe(false);
      expect(isSchemaObject([1, 2, 3])).toBe(false);
    });

    test("returns false for primitive values", () => {
      expect.hasAssertions();

      expect(isSchemaObject("string")).toBe(false);
      expect(isSchemaObject(42)).toBe(false);
      expect(isSchemaObject(true)).toBe(false);
    });
  });

  describe("isPath()", () => {
    test("returns true for non-empty string", () => {
      expect.hasAssertions();

      expect(isPath("/api/types")).toBe(true);
      expect(isPath("docs")).toBe(true);
      expect(isPath(" ")).toBe(true);
    });

    test("returns false for empty string", () => {
      expect.hasAssertions();

      expect(isPath("")).toBe(false);
    });

    test("returns false for null", () => {
      expect.hasAssertions();

      expect(isPath(null)).toBe(false);
    });

    test("returns false for undefined", () => {
      expect.hasAssertions();

      expect(isPath(undefined)).toBe(false);
    });

    test("returns false for non-string values", () => {
      expect.hasAssertions();

      expect(isPath(42)).toBe(false);
      expect(isPath(true)).toBe(false);
      expect(isPath({})).toBe(false);
      expect(isPath([])).toBe(false);
    });
  });

  describe("isGroupsObject()", () => {
    test("returns true for object mapping", () => {
      expect.hasAssertions();

      expect(isGroupsObject({ operations: "api" })).toBe(true);
      expect(isGroupsObject({ queries: "operations" })).toBe(true);
      expect(isGroupsObject({})).toBe(true);
    });

    test("returns false for null", () => {
      expect.hasAssertions();

      expect(isGroupsObject(null)).toBe(false);
    });

    test("returns false for undefined", () => {
      expect.hasAssertions();

      expect(isGroupsObject(undefined)).toBe(false);
    });

    test("returns false for arrays", () => {
      expect.hasAssertions();

      expect(isGroupsObject([])).toBe(false);
      expect(isGroupsObject(["operations"])).toBe(false);
    });

    test("returns false for primitive values", () => {
      expect.hasAssertions();

      expect(isGroupsObject("string")).toBe(false);
      expect(isGroupsObject(42)).toBe(false);
      expect(isGroupsObject(true)).toBe(false);
    });
  });

  describe("isLoaderString()", () => {
    test("returns true for string", () => {
      expect.hasAssertions();

      expect(isLoaderString("@graphql-markdown/loader-graphql")).toBe(true);
      expect(isLoaderString("./loaders/custom")).toBe(true);
      expect(isLoaderString("")).toBe(true);
    });

    test("returns false for null", () => {
      expect.hasAssertions();

      expect(isLoaderString(null)).toBe(false);
    });

    test("returns false for undefined", () => {
      expect.hasAssertions();

      expect(isLoaderString(undefined)).toBe(false);
    });

    test("returns false for non-string values", () => {
      expect.hasAssertions();

      expect(isLoaderString(42)).toBe(false);
      expect(isLoaderString(true)).toBe(false);
      expect(isLoaderString({})).toBe(false);
      expect(isLoaderString([])).toBe(false);
    });
  });

  describe("isInvalidFunctionProperty()", () => {
    test("returns true for descriptor property that is not a function", () => {
      expect.hasAssertions();

      const config = { descriptor: "not a function" };
      expect(isInvalidFunctionProperty(config, "descriptor")).toBe(true);
    });

    test("returns true for tag property that is not a function", () => {
      expect.hasAssertions();

      const config = { tag: 42 };
      expect(isInvalidFunctionProperty(config, "tag")).toBe(true);
    });

    test("returns false for descriptor property that is a function", () => {
      expect.hasAssertions();

      const config = { descriptor: () => "result" };
      expect(isInvalidFunctionProperty(config, "descriptor")).toBe(false);
    });

    test("returns false for tag property that is a function", () => {
      expect.hasAssertions();

      const config = { tag: () => "result" };
      expect(isInvalidFunctionProperty(config, "tag")).toBe(false);
    });

    test("returns false when property does not exist", () => {
      expect.hasAssertions();

      const config = { other: "value" };
      expect(isInvalidFunctionProperty(config, "descriptor")).toBe(false);
      expect(isInvalidFunctionProperty(config, "tag")).toBe(false);
    });

    test("returns false for null", () => {
      expect.hasAssertions();

      expect(isInvalidFunctionProperty(null, "descriptor")).toBe(false);
      expect(isInvalidFunctionProperty(null, "tag")).toBe(false);
    });

    test("returns false for undefined", () => {
      expect.hasAssertions();

      expect(isInvalidFunctionProperty(undefined, "descriptor")).toBe(false);
      expect(isInvalidFunctionProperty(undefined, "tag")).toBe(false);
    });

    test("returns false for non-object values", () => {
      expect.hasAssertions();

      expect(isInvalidFunctionProperty("string", "descriptor")).toBe(false);
      expect(isInvalidFunctionProperty(42, "tag")).toBe(false);
      expect(isInvalidFunctionProperty(true, "descriptor")).toBe(false);
      expect(isInvalidFunctionProperty([], "tag")).toBe(false);
    });

    test("returns true for object with multiple invalid properties", () => {
      expect.hasAssertions();

      const config = { descriptor: "not a function", tag: 42, other: () => {} };
      expect(isInvalidFunctionProperty(config, "descriptor")).toBe(true);
      expect(isInvalidFunctionProperty(config, "tag")).toBe(true);
    });

    test("handles edge case where property value is undefined", () => {
      expect.hasAssertions();

      const config = { descriptor: undefined };
      expect(isInvalidFunctionProperty(config, "descriptor")).toBe(true);
    });

    test("handles edge case where property value is null", () => {
      expect.hasAssertions();

      const config = { descriptor: null };
      expect(isInvalidFunctionProperty(config, "descriptor")).toBe(true);
    });

    test("handles property with function assigned after object creation", () => {
      expect.hasAssertions();

      const config: Record<string, unknown> = { descriptor: undefined };
      config.descriptor = () => "result";
      expect(isInvalidFunctionProperty(config, "descriptor")).toBe(false);
    });
  });
});
