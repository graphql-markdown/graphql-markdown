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
 * Log levels.
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

  const instance: LoggerType["instance"] =
    typeof moduleName === "string" && moduleName !== ""
      ? (await import(moduleName)).default
      : globalThis.console;

  const _log = (
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents -- Union required for enum/string literal compatibility with LoggerType
    level: LogLevel | keyof typeof LogLevel = LogLevel.info,
  ): void => {
    const fallback = instance[LogLevel.info];
    const callback =
      typeof instance[level] === "function" ? instance[level] : fallback;
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
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents -- Union required for enum/string literal compatibility with LoggerType
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
