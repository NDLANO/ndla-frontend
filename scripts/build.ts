/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

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
): Promise<void> => {
  try {
    const build = await new Promise<BuildOutput>(async (resolve, reject) => {
      // eslint-disable-next-line no-console
      console.log(`Compiling ${type} build...`);
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

    if (build.warnings.length) {
      print(`${type} build compiled with warnings`, build.warnings, 'warning');
    } else {
      // eslint-disable-next-line no-console
      console.log(chalk.green(`Compiled ${type} build successfully.`));
    }
  } catch (e) {
    print('Failed to compile client build', [e as Error].flat(), 'error');
    process.exitCode = 1;
  }
};

const main = async () => {
  rmSync(resolve('./build'), { recursive: true, force: true });
  await build(clientConfig, 'client');
  await build(serverConfig, 'server');
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
  logFunc(`${chalkFunc(summary)}`);
  errors.forEach(logFunc);
};

main();
