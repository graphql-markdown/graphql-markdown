// index.ts
/**
 * Logger singleton module.
 *
 * @module Logger
 * @packageDocumentation
 */

import type { LoggerType } from "@graphql-markdown/types";

/**
 * Resolves a module specifier for dynamic `import()` at runtime.
 *
 * @remarks
 * Inlined from `runtimeModuleSpecifier` in `@graphql-markdown/utils` (logger must not depend on utils).
 * On Deno, bare specifiers are not resolved from inside a JSR package and need a prefix:
 * `@graphql-markdown/*` names get `jsr:`, other bare names get `npm:`.
 *
 * @param name - the module specifier.
 * @returns the specifier to pass to `import()`.
 *
 * @internal
 */
export const runtimeModuleSpecifier = (name: string): string => {
  return !("Deno" in globalThis) ||
    /^(?:\.{1,2}\/|\/|(?:file|http|https|jsr|npm|node|data):)/.test(name)
    ? name
    : `${name.startsWith("@graphql-markdown/") ? "jsr:" : "npm:"}${name}`;
};

type GlobalWithLogger = typeof globalThis & { logger?: LoggerType | null };
const globalScope = globalThis as GlobalWithLogger;

/**
 * Log levels supported by the logger.
 *
 * @remarks
 * The logger supports standard console methods plus custom 'success' level
 * for framework-specific integrations like Docusaurus.
 *
 */
export enum LogLevel {
  debug = "debug",
  error = "error",
  info = "info",
  log = "log",
  success = "success",
  warn = "warn",
}

/**
 * Type guard to check if an object has a log method for a given level.
 *
 * @param instance - The object to check
 * @param level - The log level to verify
 * @returns `true` if the instance has a function at the given level, `false` otherwise
 */
const hasLogMethod = (
  instance: unknown,
  level: LogLevel | keyof typeof LogLevel,
): instance is Record<string, (...args: unknown[]) => unknown> => {
  return (
    typeof instance === "object" &&
    instance !== null &&
    typeof (instance as Record<string, unknown>)[level] === "function"
  );
};

/**
 * Resolve a logger instance from a module export.
 *
 * @remarks
 * Handles various module export patterns:
 * - Direct logger instance: `{ info: () => {}, ... }`
 * - Default export: `{ default: { info: () => {}, ... } }`
 * - Named export: `{ logger: { info: () => {}, ... } }`
 *
 * @param instance - The module export or object to resolve
 * @returns The logger instance if found, or `undefined` if no valid logger is detected (the caller is responsible for falling back to `globalThis.console`)
 */
const resolveLoggerInstance = (
  instance: unknown,
): LoggerType["instance"] | undefined => {
  if (hasLogMethod(instance, LogLevel.info)) {
    return instance as LoggerType["instance"];
  }

  if (
    typeof instance === "object" &&
    instance !== null &&
    "default" in instance
  ) {
    const nestedDefault = (instance as { default?: unknown }).default;
    if (hasLogMethod(nestedDefault, LogLevel.info)) {
      return nestedDefault as LoggerType["instance"];
    }
  }

  if (
    typeof instance === "object" &&
    instance !== null &&
    "logger" in instance
  ) {
    const nestedLogger = (instance as { logger?: unknown }).logger;
    if (hasLogMethod(nestedLogger, LogLevel.info)) {
      return nestedLogger as LoggerType["instance"];
    }
  }

  return undefined;
};

/**
 * Instantiate a logger module.
 * By default, the logger module uses `globalThis.console`
 *
 * @param moduleName - optional name of the logger package, or a logger instance to use directly.
 *
 * @example
 * ```js
 * import Logger, { log } from "@graphql-markdown/logger";
 *
 * log("Info message"); // Expected console output "Info message"
 *
 * Logger("@docusaurus/logger");
 * log("Info message", "info"); // Expected Docusaurus log output "Info message"
 *
 * Logger({ info: (message) => process.stdout.write(message) }); // Logger instance
 * log("Info message", "info"); // Expected custom logger output "Info message"
 * ```
 *
 */
export const Logger = async (
  moduleName?: Record<string, unknown> | string,
): Promise<void> => {
  if (globalScope.logger?.instance && moduleName === undefined) {
    return;
  }

  let moduleExports: Record<string, unknown> | undefined;
  if (typeof moduleName === "string" && moduleName !== "") {
    moduleExports = await import(runtimeModuleSpecifier(moduleName));
  } else if (typeof moduleName === "object") {
    moduleExports = moduleName;
  }

  const instance =
    resolveLoggerInstance(moduleExports) ??
    resolveLoggerInstance(moduleExports?.default) ??
    globalThis.console;

  const getCallbackForLevel = (
    instanceObj: LoggerType["instance"],
    requestedLevel: LogLevel | keyof typeof LogLevel,
  ): ((...args: unknown[]) => unknown) | undefined => {
    if (hasLogMethod(instanceObj, requestedLevel)) {
      return instanceObj[requestedLevel];
    }
    if (hasLogMethod(instanceObj, LogLevel.info)) {
      return instanceObj[LogLevel.info] as (...args: unknown[]) => unknown;
    }
    return undefined;
  };

  const _log = (
    message: string,
    level: LogLevel | keyof typeof LogLevel = LogLevel.info,
  ): void => {
    const callback = getCallbackForLevel(instance, level);
    callback?.apply(this, [message]);
  };

  globalScope.logger = { instance, _log };
};

/**
 * Logs a message by calling the active logger instance.
 *
 * @remarks
 * If a log level is not supported by the logger instance, then it defaults to `"info"`.
 *
 * @param message - a string to be logged.
 * @param level - optional log level, `"info"` by default.
 *
 * @example
 * ```js
 * import { log } from "@graphql-markdown/logger";
 *
 * log("Info message"); // Expected console output "Info message"
 * ```
 *
 */
export const log = (
  message: string,
  level: LogLevel | keyof typeof LogLevel = LogLevel.info,
): void => {
  Promise.resolve(Logger()).catch(() => {});
  globalScope.logger?._log(message, level);
};

/**
 * Internal helpers exported for testing purposes only.
 * Not part of the public API — do not use in application code.
 *
 * @internal
 */
export const __internal: {
  hasLogMethod: typeof hasLogMethod;
  resolveLoggerInstance: typeof resolveLoggerInstance;
} = { hasLogMethod, resolveLoggerInstance };

/**
 * @see log
 */
/** @alias */
export default Logger;
