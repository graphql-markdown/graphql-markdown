type LogLevel = "debug" | "error" | "info" | "log" | "success" | "warn";

export interface LoggerType {
  _log: (message: string, level?: LogLevel) => void;
  instance: Partial<Record<LogLevel, (...unknown) => void>>;
}
