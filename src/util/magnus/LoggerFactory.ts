import { LoggerImpl1 } from "./impl1";
import { Logger } from "./Logger";

export class LoggerFactory {
  static instance: LoggerFactory;
  private loggers: Map<string, Logger> = new Map();
  static getInstance(): LoggerFactory {
    if (!LoggerFactory.instance) {
      LoggerFactory.instance = new LoggerFactory();
    }
    return LoggerFactory.instance;
  }

  static getLogger(name: string): Logger {
    const instance = LoggerFactory.getInstance();
    const existingLogger = instance.loggers.get(name);
    if (existingLogger) return existingLogger;
    switch (name) {
      case "impl1":
        this.instance.loggers.set(name, new Logger(new LoggerImpl1()));
        break;
      case "impl2":
        const newLogger = new Logger(new LoggerImpl1());
        this.instance.loggers.set(name, newLogger);
        import("./impl2").then((module) => {
          const loggerBackend = new module.LoggerImpl2();
          newLogger.replaceBackend(loggerBackend);
        });
        break;
      default:
        throw new Error("Oopsi");
    }

    return instance.loggers.get(name)!;
  }
}
