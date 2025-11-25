/**
 * Option builder for handling CLI/config/default option precedence.
 *
 * This utility provides a fluent interface for merging options from multiple
 * sources (CLI, config file, defaults) with consistent precedence rules:
 * 1. CLI options (highest priority)
 * 2. Config file options
 * 3. Default values (lowest priority)
 *
 * IMPORTANT: Add values in this order for proper precedence:
 * 1. addDefault() first
 * 2. addFromConfig() second
 * 3. addFromCli() last
 *
 * Eliminates repetitive if/coalesce patterns throughout the codebase.
 *
 * @packageDocumentation
 */

import type { Maybe } from "@graphql-markdown/types";

/**
 * Builder for constructing options from multiple sources with priority precedence.
 *
 * IMPORTANT: Methods must be called in the correct order for precedence to work:
 * 1. addDefault() - lowest priority (set first)
 * 2. addFromConfig() - medium priority
 * 3. addFromCli() - highest priority (set last)
 *
 * @template T - The type of the options object being built
 *
 * @example
 * ```typescript
 * const options = new OptionBuilder<MyOptions>()
 *   // Add in order: default -> config -> cli
 *   .addDefault(false, "pretty")
 *   .addFromConfig(undefined, "pretty")
 *   .addFromCli(true, "pretty")  // CLI overrides default
 *   .addDefault("/", "baseURL")
 *   .addFromConfig("/api", "baseURL")  // Config overrides default
 *   .addFromCli(undefined, "baseURL")
 *   .build();
 * // Result: { pretty: true, baseURL: "/api" }
 * ```
 */
export class OptionBuilder<T extends Record<string, unknown>> {
  private merged: Partial<T> = {};
  private sources: Map<keyof T, "default" | "config" | "cli"> = new Map();

  /**
   * Adds a default value (lowest priority, added first).
   * Sets a value that will be overwritten by config or CLI options.
   *
   * @param value - The default value
   * @param key - The key to store the value under
   * @returns This builder for method chaining
   *
   * @example
   * ```typescript
   * builder.addDefault(3000, "port")
   * ```
   */
  addDefault<K extends keyof T>(value: Maybe<T[K]>, key: K): this {
    return this.setIfProvided(value, key, "default");
  }

  /**
   * Adds a value from config file if provided (medium priority, added second).
   * Overwrites the default value for this key if the config value exists.
   *
   * @param value - The config file option value
   * @param key - The key to store the value under
   * @returns This builder for method chaining
   *
   * @example
   * ```typescript
   * builder.addFromConfig(config.port, "port")
   * ```
   */
  addFromConfig<K extends keyof T>(value: Maybe<T[K]>, key: K): this {
    return this.setIfProvided(value, key, "config");
  }

  /**
   * Adds a value from CLI options if provided (highest priority, added last).
   * Overwrites both default and config values for this key if the CLI value exists.
   *
   * @param value - The CLI option value
   * @param key - The key to store the value under
   * @returns This builder for method chaining
   *
   * @example
   * ```typescript
   * builder.addFromCli(cliOpts.port, "port")
   * ```
   */
  addFromCli<K extends keyof T>(value: Maybe<T[K]>, key: K): this {
    return this.setIfProvided(value, key, "cli");
  }

  /**
   * Sets a value if it's not null or undefined, respecting precedence.
   * Internal helper method used by addDefault, addFromConfig, and addFromCli.
   *
   * Only updates the merged value if the source has equal or higher precedence
   * than the currently stored source. Precedence order: default < config < cli.
   *
   * @param value - The value to set
   * @param key - The key to set
   * @param source - The source of this value ('default', 'config', or 'cli')
   * @returns This builder for method chaining
   */
  private setIfProvided<K extends keyof T>(
    value: Maybe<T[K]>,
    key: K,
    source: "default" | "config" | "cli",
  ): this {
    if (value !== null && value !== undefined) {
      const precedenceOrder: Record<"default" | "config" | "cli", number> = {
        default: 0,
        config: 1,
        cli: 2,
      };
      const currentSource = this.sources.get(key);
      const shouldUpdate =
        !currentSource ||
        precedenceOrder[source] >= precedenceOrder[currentSource];

      if (shouldUpdate) {
        this.merged[key] = value;
        this.sources.set(key, source);
      }
    }
    return this;
  }

  /**
   * Transforms a value using a function if the key exists.
   * Useful for processing values after they've been set.
   *
   * @param key - The key to transform
   * @param fn - Function that transforms the current value
   * @returns This builder for method chaining
   *
   * @example
   * ```typescript
   * builder.transform("path", (p) => resolve(p))
   * ```
   */
  transform<K extends keyof T>(key: K, fn: (v: T[K]) => T[K]): this {
    if (key in this.merged) {
      this.merged[key] = fn(this.merged[key] as T[K]);
    }
    return this;
  }

  /**
   * Conditionally applies a transformation if a predicate is true.
   * Useful for applying different transformations based on other values.
   *
   * @param key - The key to potentially transform
   * @param predicate - Function that determines if transformation should apply
   * @param fn - Function that transforms the value if predicate is true
   * @returns This builder for method chaining
   *
   * @example
   * ```typescript
   * builder.transformIf("path", () => force, (p) => resolve(p))
   * ```
   */
  transformIf<K extends keyof T>(
    key: K,
    predicate: (merged: Partial<T>) => boolean,
    fn: (v: T[K]) => T[K],
  ): this {
    if (key in this.merged && predicate(this.merged)) {
      this.merged[key] = fn(this.merged[key] as T[K]);
    }
    return this;
  }

  /**
   * Gets the current value for a key without building.
   * Useful for conditional logic during building.
   * Returns a shallow copy for arrays and objects to prevent external mutations.
   *
   * @param key - The key to get
   * @returns The current value for the key, or undefined if not set
   */
  get<K extends keyof T>(key: K): T[K] | undefined {
    const value = this.merged[key] as T[K] | undefined;
    if (Array.isArray(value)) {
      return [...value] as T[K];
    }
    if (value && typeof value === "object") {
      return { ...(value as object) } as T[K];
    }
    return value;
  }

  /**
   * Returns the built options object with all accumulated values.
   * The object contains all keys that were set during the building process.
   *
   * Note: The returned object may be a partial object containing only the keys
   * that were set. Callers should handle potentially missing properties.
   * Returns a shallow copy to prevent external mutations of internal state.
   *
   * @returns The constructed options object with type Partial<T> (may not have all properties of T)
   */
  build(): Partial<T> {
    return { ...this.merged };
  }
}
