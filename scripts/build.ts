import chalk from 'chalk';
import { rmSync } from 'fs';
import { resolve } from 'path';
import webpack, { Stats, StatsCompilation } from 'webpack';
import { Configuration, StatsError } from 'webpack';
import getConfig from '../webpack/getConfig';

const configs: Configuration[] = getConfig('production');
const clientConfig = configs[0]!;
const serverConfig = configs[1]!;

interface BuildOutput {
  stats?: Stats;
  warnings: StatsError[];
}

const build = async (
  config: Configuration,
  type: 'client' | 'server',
): Promise<BuildOutput> => {
  return new Promise(async (resolve, reject) => {
    console.log(`Compiling ${type} build...\n`);
    compile(
      config,
      (err, stats) => {
        if (err) {
          return reject(err);
        }
        const messages: StatsCompilation | undefined = stats?.toJson();
        if (messages?.errors?.length) {
          return reject(messages.errors);
        }

        return resolve({
          stats,
          warnings: messages?.warnings ?? [],
        });
      },
      err => reject(err),
    );
  });
};

const main = async () => {
  rmSync(resolve('./build'), { recursive: true });
  try {
    const clientBuild = await build(clientConfig, 'client');
    if (clientBuild.warnings.length) {
      print(
        'Client build compiled with warnings\n',
        clientBuild.warnings,
        'warning',
      );
    } else {
      console.log(chalk.green('Compiled client build successfully.\n'));
    }
  } catch (e) {
    print('Failed to compile client build', [e as Error].flat(), 'error');
    process.exitCode = 1;
  }
  try {
    const serverBuild = await build(serverConfig, 'server');
    if (serverBuild.warnings.length) {
      print(
        'Server build compiled with warnings\n',
        serverBuild.warnings,
        'warning',
      );
    } else {
      console.log(chalk.green('Compiled client build successfully.\n'));
    }
  } catch (e) {
    print('Failed to compile client build', [e as Error].flat(), 'error');
  }
};

const compile = (
  config: Configuration,
  callback: (err?: Error | null, stats?: Stats) => void,
  internalErrorCallback: (e: Error) => void,
) => {
  try {
    const compiler = webpack(config);
    compiler.run((err, stats) => callback(err, stats));
  } catch (e) {
    print('Failed to compile.', [e as Error], 'error');
    return internalErrorCallback(e as Error);
  }
};

const print = (
  summary: string,
  errors: string[] | StatsError[] | Error[],
  type: 'warning' | 'error',
) => {
  const chalkFunc = type === 'warning' ? chalk.yellow : chalk.red;
  const logFunc = type === 'warning' ? console.warn : console.error;
  logFunc(`${chalkFunc(summary)}\n`);
  errors.forEach(logFunc);
};

main();
