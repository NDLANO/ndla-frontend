import { LoggerBackend } from "./LoggerBackend";

console.log("Impl2 imported!!");

export class LoggerImpl2 implements LoggerBackend {
  error(message: string) {
    console.error(`[IMPL2 - error] ${message}`);
  }
  warn(message: string) {
    console.warn(`[IMPL2 - warn] ${message}`);
  }
  info(message: string) {
    console.info(`[IMPL2 - info] ${message}`);
  }
}
