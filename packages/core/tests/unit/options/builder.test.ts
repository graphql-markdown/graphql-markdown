/**
 * Tests for OptionBuilder utility.
 */

import { OptionBuilder } from "../../../src/options/builder";

interface TestOptions extends Record<string, unknown> {
  name: string;
  count: number;
  enabled: boolean;
  path?: string;
}

describe("OptionBuilder", () => {
  describe("addFromCli", () => {
    it("should set value from CLI option when provided", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addDefault("Default", "name").addFromCli("Alice", "name");

      expect(builder.get("name")).toBe("Alice");
    });

    it("should overwrite default and config values", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder
        .addDefault("Default", "name")
        .addFromConfig("Config", "name")
        .addFromCli("CLI Value", "name");

      expect(builder.get("name")).toBe("CLI Value");
    });

    it("should not set value when CLI option is undefined", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addDefault("Default", "name").addFromCli(undefined, "name");

      expect(builder.get("name")).toBe("Default");
    });

    it("should not set value when CLI option is null", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addDefault("Default", "name").addFromCli(null, "name");

      expect(builder.get("name")).toBe("Default");
    });
  });

  describe("addFromConfig", () => {
    it("should set value from config when provided", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder
        .addDefault("Default", "name")
        .addFromConfig("Config Value", "name");

      expect(builder.get("name")).toBe("Config Value");
    });

    it("should overwrite default value", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder
        .addDefault("Default Value", "name")
        .addFromConfig("Config Value", "name");

      expect(builder.get("name")).toBe("Config Value");
    });

    it("should not set value when config option is undefined", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addDefault("Default", "name").addFromConfig(undefined, "name");

      expect(builder.get("name")).toBe("Default");
    });

    it("should not set value when config option is null", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addDefault("Default", "name").addFromConfig(null, "name");

      expect(builder.get("name")).toBe("Default");
    });
  });

  describe("addDefault", () => {
    it("should set default value when no other value is set", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addDefault("Default", "name");

      expect(builder.get("name")).toBe("Default");
    });

    it("should be overwritten by config value when config is added after", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder
        .addDefault("Default", "name")
        .addFromConfig("Config Value", "name");

      expect(builder.get("name")).toBe("Config Value");
    });

    it("should be overwritten by CLI value when CLI is added after", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addDefault("Default", "name").addFromCli("CLI Value", "name");

      expect(builder.get("name")).toBe("CLI Value");
    });

    it("should set value even if later source is undefined", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder
        .addDefault("Default", "name")
        .addFromConfig(undefined, "name")
        .addFromCli(undefined, "name");

      expect(builder.get("name")).toBe("Default");
    });
  });

  describe("Precedence order", () => {
    it("should respect Default -> Config -> CLI precedence (add in this order)", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder
        .addDefault("Default", "name")
        .addFromConfig("Config", "name")
        .addFromCli("CLI", "name");

      expect(builder.get("name")).toBe("CLI");
    });

    it("should use Config when CLI is not provided", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addDefault("Default", "name").addFromConfig("Config", "name");
      // Don't add from CLI

      expect(builder.get("name")).toBe("Config");
    });

    it("should use Default when CLI and Config are not provided", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addDefault("Default", "name");
      // Don't add from config or CLI

      expect(builder.get("name")).toBe("Default");
    });
  });

  describe("transform", () => {
    it("should transform value when key exists", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addFromCli(5, "count").transform("count", (v) => v * 2);

      expect(builder.get("count")).toBe(10);
    });

    it("should not apply transformation when key does not exist", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.transform("count", (v) => v * 2);

      expect(builder.get("count")).toBeUndefined();
    });

    it("should support chaining multiple transforms", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder
        .addFromCli(5, "count")
        .transform("count", (v) => v * 2)
        .transform("count", (v) => v + 1)
        .transform("count", (v) => v * 3);

      expect(builder.get("count")).toBe(33); // ((5 * 2) + 1) * 3
    });

    it("should support string transformations", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder
        .addFromCli("  hello  ", "name")
        .transform("name", (v) => v.trim())
        .transform("name", (v) => v.toUpperCase());

      expect(builder.get("name")).toBe("HELLO");
    });
  });

  describe("transformIf", () => {
    it("should apply transformation when predicate is true", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder
        .addFromCli(5, "count")
        .addFromCli(true, "enabled")
        .transformIf(
          "count",
          (merged) => merged.enabled === true,
          (v) => v * 2,
        );

      expect(builder.get("count")).toBe(10);
    });

    it("should not apply transformation when predicate is false", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder
        .addFromCli(5, "count")
        .addFromCli(false, "enabled")
        .transformIf(
          "count",
          (merged) => merged.enabled === true,
          (v) => v * 2,
        );

      expect(builder.get("count")).toBe(5);
    });

    it("should not apply transformation when key does not exist", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addFromCli(true, "enabled").transformIf(
        "count",
        (merged) => merged.enabled === true,
        (v) => v * 2,
      );

      expect(builder.get("count")).toBeUndefined();
    });
  });

  describe("build", () => {
    it("should return complete options object", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      const options = builder
        .addFromCli("Alice", "name")
        .addDefault(10, "count")
        .addDefault(true, "enabled")
        .build();

      expect(options).toEqual({
        name: "Alice",
        count: 10,
        enabled: true,
      });
    });

    it("should return partial options when not all keys are set", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      const options = builder.addFromCli("Alice", "name").build();

      expect(options).toEqual({ name: "Alice" });
      expect(Object.keys(options).length).toBe(1);
    });

    it("should support multiple independent builders", () => {
      expect.hasAssertions();

      const builder1 = new OptionBuilder<TestOptions>().addFromCli(
        "Alice",
        "name",
      );
      const builder2 = new OptionBuilder<TestOptions>().addFromCli(
        "Bob",
        "name",
      );

      expect(builder1.build()).toEqual({ name: "Alice" });
      expect(builder2.build()).toEqual({ name: "Bob" });
    });
  });

  describe("Method chaining", () => {
    it("should support fluent interface with all methods", () => {
      expect.hasAssertions();

      const options = new OptionBuilder<TestOptions>()
        .addDefault("Default", "name")
        .addFromConfig("Config", "name")
        .addFromCli("CLI", "name")
        .addDefault(0, "count")
        .addFromConfig(5, "count")
        .addDefault(true, "enabled")
        .transform("count", (v) => v * 2)
        .build();

      expect(options).toEqual({
        name: "CLI",
        count: 10, // 5 * 2
        enabled: true,
      });
    });

    it("should allow get() during building", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addFromCli("Alice", "name");
      const name = builder.get("name");

      expect(name).toBe("Alice");

      builder.addDefault(20, "count");
      const count = builder.get("count");

      expect(count).toBe(20);
    });
  });

  describe("Edge cases", () => {
    it("should handle boolean false values correctly", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addFromCli(false, "enabled");

      expect(builder.get("enabled")).toBe(false);
    });

    it("should handle zero values correctly", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addFromCli(0, "count");

      expect(builder.get("count")).toBe(0);
    });

    it("should handle empty string values correctly", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addFromCli("", "name");

      expect(builder.get("name")).toBe("");
    });

    it("should not confuse undefined config with not-yet-set value", () => {
      expect.hasAssertions();

      const builder = new OptionBuilder<TestOptions>();
      builder.addFromCli(undefined, "name");
      builder.addFromConfig("Config", "name");

      // Config should be used since CLI was undefined
      expect(builder.get("name")).toBe("Config");
    });
  });
});
