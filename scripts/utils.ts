import { Compiler } from 'webpack';
import chalk from 'chalk';

type TextType = 'error' | 'warning' | 'info' | 'default';
type Color = 'red' | 'yellow' | 'blue' | 'white';

const colorMap: Record<TextType, Color> = {
  error: 'red',
  warning: 'yellow',
  info: 'blue',
  default: 'white',
};

export const logMessage = (
  message: string | Error,
  level: TextType = 'info',
) => {
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}]`, chalk[colorMap[level]](message));
};

export const compilerPromise = (name: string, compiler: Compiler) => {
  return new Promise<void>((resolve, reject) => {
    compiler?.hooks.compile.tap(name, () => {
      logMessage(`[${name}] Compiling`);
    });
    compiler?.hooks.done.tap(name, stats => {
      if (!stats.hasErrors()) {
        return resolve();
      }
      return reject(`Failed to compile ${name}`);
    });
  });
};
