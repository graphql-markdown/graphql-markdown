/** Represents the available logging levels */
type LogLevel = "debug" | "error" | "info" | "log" | "success" | "warn";

/** Interface for logger implementation */
export interface LoggerType {
  /**
   * Internal logging method
   * @param message - The message to log
   * @param level - Optional logging level
   */
  _log: (message: string, level?: LogLevel) => void;

  /**
   * Logger instance with methods for each log level
   * Each method accepts variable arguments of unknown type
   */
  instance: Partial<Record<LogLevel, (...unknown) => void>>;
}
