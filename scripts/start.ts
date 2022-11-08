/// <reference path="../node_modules/webpack-dev-server/types/lib/Server.d.ts"/>
import webpack, { Compiler, Configuration, Watching } from 'webpack';
import devServer from 'webpack-dev-server';
import getConfig from '../webpack/getConfig';

const configs: Configuration[] = getConfig(
  process.env.NODE_ENV ?? 'development',
);
const clientConfig = configs[0]!;
const serverConfig = configs[1]!;

const start = async () => {
  process.removeAllListeners('warning');
  const clientCompiler = compile(clientConfig);
  const serverCompiler = compile(serverConfig);
  const port = clientConfig.devServer?.port ?? process.env.PORT;

  let watching: Watching;

  if (clientCompiler) {
    clientCompiler.hooks.done.tap('client', () => {
      if (watching) {
        return;
      }
      watching = serverCompiler.watch({}, _stats => {});
    });
  } else {
  }
  const clientDevServer = new devServer(
    clientCompiler,
    Object.assign(clientConfig.devServer!, { port }),
  );
  clientDevServer.startCallback(errorLogger);
};

const errorLogger = (err: any) => {
  if (err) {
    console.error(err);
  }
};
const compile = (config: Configuration) => {
  let compiler: Compiler;
  try {
    compiler = webpack(config);
  } catch (e) {
    console.error(e as Error);
    process.exit(1);
  }
  return compiler;
};

start();
