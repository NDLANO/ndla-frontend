module.exports = options => (config, env, webpack) => {
  const appConfig = config;
  const { target, dev } = env;

  if (target === 'web') {
    if (dev) {
      appConfig[options.name] = [
        appConfig.entry.client[1], // hot reloading
        options.entry,
      ];
    } else {
      appConfig.entry[options.name] = [options.entry];
    }
  }

  return appConfig;
};
