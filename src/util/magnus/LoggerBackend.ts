export interface LoggerBackend {
  error: (message: string) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
}
