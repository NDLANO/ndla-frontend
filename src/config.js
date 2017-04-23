/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const environment = {
  development: {
    isProduction: false,
  },
  production: {
    isProduction: true,
  },
}[process.env.NODE_ENV || 'development'];

const ndlaEnvironment = process.env.NDLA_ENVIRONMENT || 'test';
const apiDomain = () => {
  switch (process.env.NDLA_ENVIRONMENT) {
    case 'local':
      return 'http://proxy.ndla-local';
    case 'prod':
      return 'https://api.ndla.no';
    default:
      return `https://${ndlaEnvironment}.api.ndla.no`;
  }
};

const ndlaFrontendDomain = () => {
  switch (process.env.NDLA_ENVIRONMENT) {
    case 'local':
      return 'http://localhost:30017';
    case 'prod':
      return 'https://ndla-frontend.api.ndla.no';
    default:
      return `https://ndla-frontend.${ndlaEnvironment}.api.ndla.no`;
  }
};

const learningPathDomain = () => {
  switch (process.env.NDLA_ENVIRONMENT) {
    case 'local':
      return 'http://localhost:30007';
    case 'prod':
      return 'http://learningpath-frontend.api.ndla.no';
    default:
      return `http://learningpath-frontend.${ndlaEnvironment}.api.ndla.no`;
  }
};

module.exports = Object.assign({
  componentName: process.env.npm_package_name,
  host: process.env.NDLA_FRONTENTD_HOST || 'localhost',
  port: process.env.NDLA_FRONTENTD_PORT || '3000',
  redirectPort: process.env.NDLA_REDIRECT_PORT || '3001',
  googleTagMangerId: process.env.GOOGLE_TAG_MANGER_ID || undefined,
  logEnvironment: process.env.NDLA_ENVIRONMENT || 'local',
  logglyApiKey: process.env.LOGGLY_API_KEY,
  disableSSR: process.env.DISABLE_SSR || false,
  ndlaApiUrl: process.env.NDLA_API_URL || apiDomain(),
  ndlaFrontendClientId: process.env.NDLA_FRONTEND_CLIENT_ID || 'swagger-client',
  ndlaFrontendClientSecret: process.env.NDLA_FRONTEND_CLIENT_SECRET || 'swagger-public-client-secret',
  ndlaFrontendDomain: ndlaFrontendDomain(),
  learningPathDomain: learningPathDomain(),
}, environment);
