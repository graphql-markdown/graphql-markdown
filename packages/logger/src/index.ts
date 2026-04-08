// index.ts
/**
 * Logger singleton module.
 *
 * @module Logger
 * @packageDocumentation
 */

import type { LoggerType, Maybe } from "@graphql-markdown/types";

declare global {
  var logger: Maybe<LoggerType>;
}

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
 * @remarks
 * This is an internal helper function exported for testing purposes.
 *
 * @param instance - The object to check
 * @param level - The log level to verify
 * @returns `true` if the instance has a function at the given level, `false` otherwise
 *
 * @example
 * ```ts
 * const logger = { info: (msg: string) => console.info(msg) };
 * hasLogMethod(logger, LogLevel.info); // true
 * hasLogMethod(logger, LogLevel.error); // false
 * ```
 *
 * @internal
 */
export const hasLogMethod = (
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
 * Falls back to `globalThis.console` if no valid logger is found.
 *
 * This is an internal helper function exported for testing purposes.
 *
 * @param instance - The module export or object to resolve
 * @returns The logger instance if found, or undefined (will fall back to console)
 *
 * @example
 * ```ts
 * // ES module with default export
 * const exported = await import('@docusaurus/logger');
 * const logger = resolveLoggerInstance(exported);
 * ```
 *
 * @internal
 */
export const resolveLoggerInstance = (
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
 * @param moduleName - optional name of the logger package.
 *
 * @example
 * ```js
 * import Logger, { log } from "@graphql-markdown/logger";
 *
 * log("Info message"); // Expected console output "Info message"
 *
 * Logger("@docusaurus/logger");
 * log("Info message", "info"); // Expected Docusaurus log output "Info message"
 * ```
 *
 */
export const Logger = async (moduleName?: string): Promise<void> => {
  if (globalThis.logger?.instance && moduleName === undefined) {
    return;
  }

  const moduleExports =
    typeof moduleName === "string" && moduleName !== ""
      ? await import(moduleName)
      : undefined;

  const instance =
    resolveLoggerInstance(moduleExports) ??
    resolveLoggerInstance(moduleExports?.default) ??
    globalThis.console;

  const _log = (
    message: string,

    level: LogLevel | keyof typeof LogLevel = LogLevel.info,
  ): void => {
    const callback = hasLogMethod(instance, level)
      ? instance[level]
      : hasLogMethod(instance, LogLevel.info)
        ? instance[LogLevel.info]
        : undefined;
    callback?.apply(this, [message]);
  };

  globalThis.logger = { instance, _log };
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
  globalThis.logger?._log(message, level);
};

/**
 * @see log
 */
/** @alias */
export default Logger;
