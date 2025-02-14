import { LoggerBackend } from "./LoggerBackend";

console.log("Impl1 imported!!");

export class LoggerImpl1 implements LoggerBackend {
  error(message: string) {
    console.error(`[IMPL1 - error] ${message}`);
  }
  warn(message: string) {
    console.warn(`[IMPL1 - warn] ${message}`);
  }
  info(message: string) {
    console.info(`[IMPL1 - info] ${message}`);
  }
}
