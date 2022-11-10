/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import webpack, { Compiler, Configuration } from 'webpack';
import nodemon from 'nodemon';
import express from 'express';
import chalk from 'chalk';
import { rmSync } from 'fs';
import { resolve } from 'path';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import getConfig from '../webpack/getConfig';

const [clientConfig, serverConfig] = getConfig('development') as [
  Configuration,
  Configuration,
];

const app = express();

const WEBPACK_PORT = process.env.PORT ? parseInt(process.env.PORT) + 1 : 3001;

const DEVSERVER_HOST = 'http://localhost';

const start = async () => {
  clientConfig.entry = Object.entries(clientConfig.entry!).reduce<
    Record<string, string[]>
  >((acc, entry) => {
    acc[entry[0]] = [
      `webpack-hot-middleware/client?path=http://localhost:${WEBPACK_PORT}/__webpack_hmr&timeout=2000&reload=true`,
      ...entry[1],
    ];

    return acc;
  }, {});

  const publicPath = clientConfig.output!.publicPath;

  clientConfig.output!.publicPath = [
    `${DEVSERVER_HOST}:${WEBPACK_PORT}`,
    publicPath,
  ]
    .join('/')
    .replace(/([^:+])\/+/g, '$1/');

  serverConfig.output!.publicPath = [
    `${DEVSERVER_HOST}:${WEBPACK_PORT}`,
    publicPath,
  ]
    .join('/')
    .replace(/([^:+])\/+/g, '$1/');

  rmSync(resolve('./build'), { recursive: true });
  const multiCompiler = webpack([serverConfig, clientConfig]);

  const clientCompiler = multiCompiler.compilers.find(
    comp => comp.name === 'client',
  )!;

  const serverCompiler = multiCompiler.compilers.find(
    comp => comp.name === 'server',
  )!;

  const watchOptions = {
    ignored: /node_modules/,
    stats: clientConfig.stats,
  };

  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    return next();
  });

  const clientPromise = compilerPromise('client', clientCompiler);
  const serverPromise = compilerPromise('server', serverCompiler);

  app.use(
    webpackDevMiddleware(clientCompiler, {
      publicPath: clientConfig.output!.publicPath,
      stats: clientConfig.stats,
      writeToDisk: true,
    }),
  );

  app.use(webpackHotMiddleware(clientCompiler));

  app.listen(WEBPACK_PORT);

  //@ts-ignore
  serverCompiler.watch(watchOptions, (error, stats) => {
    if (!error && !stats?.hasErrors()) {
      // eslint-disable-next-line no-console
      console.log(stats?.toString(serverConfig.stats));
      return;
    }

    if (error) {
      logMessage(error, 'error');
    }

    if (stats?.hasErrors()) {
      const info = stats.toJson();
      console.error(info.errors);
      // const errors = info?.errors?.[0]?.split('\n') ?? [];
      // logMessage(errors[0] ?? '', 'error');
      // logMessage(errors[1] ?? '', 'error');
      // logMessage(errors[2] ?? '', 'error');
    }
  });

  try {
    await clientPromise;
    await serverPromise;
  } catch (error) {
    logMessage(error as Error, 'error');
  }

  const script = nodemon({
    script: `build/server.js`,
    ignore: ['src', 'scripts', 'webpack', './*.*', 'build/client'],
    delay: 200,
  });

  script?.on('quit', () => {
    // eslint-disable-next-line no-console
    console.info('Process ended');
    process.exit();
  });

  script?.on('error', () => {
    logMessage('An error occurred. Exiting', 'error');
    process.exit(1);
  });
};

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
  console.log(chalk[colorMap[level]](message));
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

start();
