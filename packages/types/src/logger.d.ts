type LogLevel = "debug" | "error" | "info" | "log" | "success" | "warn";

export interface LoggerType {
  _log: (message: string, level?: LogLevel) => void;
  instance: {
    [level in LogLevel]?: (...unknown) => void;
  };
}
