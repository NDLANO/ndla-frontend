/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Configuration, webpack } from 'webpack';
import express from 'express';
import chalk from 'chalk';
import { rmSync } from 'fs';
import { resolve } from 'path';
import devServer from 'webpack-dev-server';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import getConfig from '../webpack/getConfig';

const [clientConfig, serverConfig] = getConfig('development') as [
  Configuration,
  Configuration,
];

const start = async () => {
  rmSync(resolve('./build'), { recursive: true, force: true });
  const clientCompiler = compile(clientConfig);
  const serverCompiler = compile(serverConfig);
  const server = express();
  server.use(
    webpackDevMiddleware(serverCompiler, {
      // This publicPath has to match the client publicPath
      publicPath: clientConfig.output?.publicPath,
      writeToDisk: true,
      stats: serverConfig.stats,
    }),
  );
  server.use(webpackHotMiddleware(serverCompiler, { heartbeat: 100 }));

  const clientDevServer = new devServer(
    Object.assign(clientConfig.devServer!, { port: 3001 }),
    clientCompiler,
  );

  clientDevServer.startCallback((err) => {
    if (err) {
      logMessage(err, 'error');
    }
  });

  const serverBuildPromise = new Promise<void>((resolve) => {
    serverCompiler.hooks.done.tap('server', () => resolve());
  });

  const clientBuildPromise = new Promise<void>((resolve) => {
    clientCompiler.hooks.done.tap('client', () => resolve());
  });
  await clientBuildPromise;
  await serverBuildPromise;
  const app = require('../build/server').default;
  server.use((req, res) => app.handle(req, res));
};

const compile = (config: Configuration) => {
  try {
    return webpack(config);
  } catch (e) {
    logMessage(e as Error, 'error');
    process.exit(1);
  }
};

type TextType = keyof Pick<Console, 'error' | 'warn' | 'info' | 'log'>;
type Color = 'red' | 'yellow' | 'blue' | 'white';

const colorMap: Record<TextType, Color> = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  log: 'white',
};

export const logMessage = (
  message: string | Error,
  level: TextType = 'info',
) => {
  // eslint-disable-next-line no-console
  console[level](chalk[colorMap[level] ?? colorMap.log!](message));
};

start();
