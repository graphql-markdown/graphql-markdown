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
 * @template T - The type of the options object being built
 *
 * @example
 * ```typescript
 * const options = new OptionBuilder<MyOptions>()
 *   // Add in order: default -> config -> cli
 *   .addDefault(false, "pretty")
 *   .addFromConfig(config.pretty, "pretty")
 *   .addFromCli(cliOpts.pretty, "pretty")
 *   .addDefault("/", "baseURL")
 *   .addFromConfig(config.baseURL, "baseURL")
 *   .addFromCli(cliOpts.base, "baseURL")
 *   .build();
 * // Result: { pretty: true, baseURL: "/api" }
 * ```
 */
export class OptionBuilder<T extends Record<string, unknown>> {
  private merged: Partial<T> = {};

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
    return this.setIfProvided(value, key);
  }

  /**
   * Adds a value from config file if provided (medium priority, added second).
   * Overwrites the default value for this key if the config value exists.
   *
   * Implementation note: This method has identical implementation to addFromCli
   * and addDefault by design. They all delegate to setIfProvided() which handles
   * the null/undefined check. The semantic difference is in precedence order and
   * documentation - callers should invoke methods in order: addDefault ->
   * addFromConfig -> addFromCli for correct precedence.
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
    return this.setIfProvided(value, key);
  }

  /**
   * Adds a value from CLI options if provided (highest priority, added last).
   * Overwrites both default and config values for this key if the CLI value exists.
   *
   * Implementation note: This method has identical implementation to addFromConfig
   * and addDefault by design. They all delegate to setIfProvided() which handles
   * the null/undefined check. The semantic difference is in precedence order and
   * documentation - callers should invoke methods in order: addDefault ->
   * addFromConfig -> addFromCli for correct precedence.
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
    return this.setIfProvided(value, key);
  }

  /**
   * Sets a value if it's not null or undefined.
   * Internal helper method used by addDefault, addFromConfig, and addFromCli.
   *
   * @param value - The value to set
   * @param key - The key to set
   * @returns This builder for method chaining
   */
  private setIfProvided<K extends keyof T>(value: Maybe<T[K]>, key: K): this {
    if (value !== null && value !== undefined) {
      this.merged[key] = value;
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
   *
   * @param key - The key to get
   * @returns The current value for the key, or undefined if not set
   */
  get<K extends keyof T>(key: K): T[K] | undefined {
    return this.merged[key] as T[K] | undefined;
  }

  /**
   * Returns the built options object with all accumulated values.
   * The object contains all keys that were set, with types enforced by T.
   *
   * @returns The fully constructed options object
   */
  build(): T {
    return this.merged as T;
  }
}
