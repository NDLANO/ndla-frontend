import { LoggerBackend } from "./LoggerBackend";

export class Logger {
  backend: LoggerBackend;
  constructor(logger: LoggerBackend) {
    this.backend = logger;
  }

  replaceBackend(logger: LoggerBackend) {
    this.backend = logger;
  }

  error(message: string) {
    this.backend.error(message);
  }
  warn(message: string) {
    this.backend.warn(message);
  }
  info(message: string) {
    this.backend.info(message);
  }
}
