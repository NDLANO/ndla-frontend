import webpack from 'webpack';
import nodemon from 'nodemon';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
// import devServer from 'webpack-dev-server';
import getConfig from '../webpack/getConfig';
import { compilerPromise, logMessage } from './utils';

const config = getConfig(process.env.NODE_ENV || 'development');

const app = express();

const WEBPACK_PORT = 3001;

const DEVSERVER_HOST = process.env.DEVSERVER_HOST || 'http://localhost';

const start = async () => {
  const clientConfig: webpack.Configuration = config![0]!;
  const serverConfig: webpack.Configuration = config![1]!;
  clientConfig.entry = Object.entries(clientConfig.entry!).reduce<
    Record<string, string[]>
  >((acc, entry) => {
    acc[entry[0]] = [
      `webpack-hot-middleware/client?path=${DEVSERVER_HOST}:${WEBPACK_PORT}/__webpack_hmr`,
      ...entry[1],
    ];

    return acc;
  }, {});

  // Place dev Server one port above client
  // const devServerPort = process.env.PORT
  //   ? parseInt(process.env.PORT) + 1
  //   : 3001;

  clientConfig.output!.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
  clientConfig.output!.hotUpdateChunkFilename =
    'updates/[id].[fullhash].hot-update.js';

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

  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);

  const watchOptions = {
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

  app.use(
    webpackHotMiddleware(clientCompiler, {
      path: '/__webpack_hmr',
      log: false,
      heartbeat: 2000,
    }),
  );

  app.use('/static', express.static('build/client'));

  app.listen(WEBPACK_PORT);

  // const clientDevServer = new devServer(
  //   clientCompiler,
  //   Object.assign(clientConfig.devServer ?? {}, { port: 8501 + 1 }),
  // );

  // clientDevServer.startCallback(err => logMessage(err ?? '', 'error'));

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

  script?.on('restart', () => {
    logMessage('Server side app has been restarted', 'warning');
  });

  script?.on('quit', () => {
    // eslint-disable-next-line no-console
    console.log('Process ended');
    process.exit();
  });

  script?.on('error', () => {
    logMessage('An error occurred. Exiting', 'error');
    process.exit(1);
  });
};

start();
