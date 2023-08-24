type LogLevel = "debug" | "error" | "info" | "log" | "success" | "warn";

export type LoggerType = {
  _log: (message: string, level?: LogLevel) => void;
  instance: {
    [level in LogLevel]?: (...unknown) => void;
  };
};
