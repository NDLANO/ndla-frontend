/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const getEnvironmentVariabel = (key, fallback = undefined) => {
  const env = 'env';
  const variabel = process[env][key]; // Hack to prevent DefinePlugin replacing process.env
  return variabel || fallback;
};

const ndlaEnvironment = 'brukertest'; //getEnvironmentVariabel('NDLA_ENVIRONMENT', 'dev');
const ndlaEnvironmentHostname = ndlaEnvironment.replace('_', '-');

const apiDomain = () => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'http://api-gateway.ndla-local';
    case 'dev':
      return 'https://test.api.ndla.no';
    case 'prod':
      return 'https://api.ndla.no';
    default:
      return `https://${ndlaEnvironmentHostname}.api.ndla.no`;
  }
};

const ndlaFrontendDomain = () => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'http://localhost:30017';
    case 'dev':
      return 'https://ndla-frontend.test.api.ndla.no';
    case 'prod':
      return 'https://ndla.no';
    default:
      return `https://ndla-frontend.${ndlaEnvironmentHostname}.api.ndla.no`;
  }
};

const learningPathDomain = () => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'http://localhost:30007';
    case 'dev':
      return 'https://learningpath-frontend.test.api.ndla.no';
    case 'prod':
      return 'https://stier.ndla.no';
    default:
      return `https://learningpath-frontend.${ndlaEnvironmentHostname}.api.ndla.no`;
  }
};

const gaTrackingId = () => {
  if (process.env.NODE_ENV !== 'production') {
    return '';
  }

  switch (ndlaEnvironment) {
    case 'local':
      return '';
    case 'dev':
      return '';
    case 'prod':
      return 'UA-9036010-1';
    default:
      return 'UA-9036010-31';
  }
};

const logglyApiKey = () => {
  if (process.env.NODE_ENV === 'unittest') {
    return '';
  }
  return getEnvironmentVariabel('LOGGLY_API_KEY');
};

const config = {
  componentName: 'ndla-frontend',
  ndlaEnvironment,
  host: getEnvironmentVariabel('NDLA_FRONTEND_HOST', 'localhost'),
  port: getEnvironmentVariabel('NDLA_FRONTEND_PORT', '3000'),
  redirectPort: getEnvironmentVariabel('NDLA_REDIRECT_PORT', '3001'),
  logEnvironment: getEnvironmentVariabel('NDLA_ENVIRONMENT', 'local'),
  logglyApiKey: logglyApiKey(),
  disableSSR: getEnvironmentVariabel('RAZZLE_DISABLE_SSR', false),
  isNdlaProdEnvironment: ndlaEnvironment === 'prod',
  ndlaApiUrl: getEnvironmentVariabel('NDLA_API_URL', apiDomain()),
  ndlaFrontendDomain: ndlaFrontendDomain(),
  learningPathDomain: learningPathDomain(),
  googleTagManagerId: getEnvironmentVariabel('NDLA_GOOGLE_TAG_MANAGER_ID'),
  gaTrackingId: gaTrackingId(),
  zendeskWidgetKey: getEnvironmentVariabel('NDLA_ZENDESK_WIDGET_KEY'),
  localGraphQLApi: getEnvironmentVariabel('LOCAL_GRAPHQL_API', false),
  showAllFrontpageSubjects: true,
  oldNdlaProxyUrl: getEnvironmentVariabel(
    'OLD_NDLA_PROXY_URL',
    'https://2018.ndla.no',
  ),
};

export function getUniversalConfig() {
  return process.env.BUILD_TARGET === 'server' ||
    process.env.NODE_ENV === 'unittest'
    ? config
    : window.DATA.config;
}

export default getUniversalConfig();
