/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { LocaleType } from './interfaces';

export function getEnvironmentVariabel(key: string, fallback: string): string;
export function getEnvironmentVariabel(key: string, fallback: boolean): boolean;
export function getEnvironmentVariabel(
  key: string,
  fallback?: string,
): string | undefined;
export function getEnvironmentVariabel(
  key: string,
  fallback?: string | boolean,
): string | boolean | undefined {
  const env = 'env';
  const variableValue = process[env][key]; // Hack to prevent DefinePlugin replacing process.env
  if (typeof fallback === 'boolean') {
    return variableValue ? variableValue.toLowerCase() === 'true' : fallback;
  }

  return variableValue || fallback;
}

const ndlaEnvironment = getEnvironmentVariabel('NDLA_ENVIRONMENT', 'dev');
const ndlaEnvironmentHostname = ndlaEnvironment.replace('_', '-');

const apiDomain = (): string => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'http://api-gateway.ndla-local';
    case 'dev':
      return 'https://api.test.ndla.no';
    case 'prod':
      return 'https://api.ndla.no';
    default:
      return `https://api.${ndlaEnvironmentHostname}.ndla.no`;
  }
};

const ndlaFrontendDomain = (): string => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'http://localhost:30017';
    case 'dev':
      return 'https://test.ndla.no';
    case 'prod':
      return 'https://ndla.no';
    default:
      return `https://${ndlaEnvironmentHostname}.ndla.no`;
  }
};

const learningPathDomain = (): string => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'http://localhost:30007';
    case 'dev':
      return 'https://stier.test.ndla.no';
    case 'prod':
      return 'https://stier.ndla.no';
    default:
      return `https://stier.${ndlaEnvironmentHostname}.ndla.no`;
  }
};

export const feideDomain = (): string => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'http://localhost:30017';
    case 'dev':
      return 'http://localhost:3000';
    case 'prod':
      return 'https://ndla.no';
    default:
      return `https://${ndlaEnvironmentHostname}.ndla.no`;
  }
};

export const matomoDomain = (): string => {
  switch (ndlaEnvironment) {
    case 'dev':
      return 'https://analytics.test.ndla.no/';
    case 'prod':
      return 'https://analytics.ndla.no/';
    default:
      return `https://analytics.${ndlaEnvironmentHostname}.ndla.no/`;
  }
};

const gaTrackingId = (): string => {
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

const logglyApiKey = (): string | undefined => {
  if (process.env.NODE_ENV === 'unittest') {
    return '';
  }
  return getEnvironmentVariabel('LOGGLY_API_KEY');
};

export const getDefaultLocale = () =>
  getEnvironmentVariabel('NDLA_DEFAULT_LOCALE', 'nb');

export type ConfigType = {
  defaultLocale: LocaleType;
  componentName: string;
  ndlaEnvironment: string;
  host: string;
  port: string;
  redirectPort: string;
  logEnvironment: string;
  logglyApiKey: string | undefined;
  disableSSR: boolean;
  isNdlaProdEnvironment: boolean;
  ndlaApiUrl: string;
  ndlaFrontendDomain: string;
  learningPathDomain: string;
  googleTagManagerId: string | undefined;
  gaTrackingId: string | undefined;
  zendeskWidgetKey: string | undefined;
  localGraphQLApi: boolean;
  showAllFrontpageSubjects: boolean;
  feideClientID?: string;
  feideClientSecret?: string;
  feideDomain: string;
  feideEnabled: boolean;
  matomoUrl: string;
  matomoSiteId: string;
};

const config: ConfigType = {
  defaultLocale: getEnvironmentVariabel(
    'NDLA_DEFAULT_LOCALE',
    'nb',
  ) as LocaleType,
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
  ndlaFrontendDomain: getEnvironmentVariabel(
    'FRONTEND_DOMAIN',
    ndlaFrontendDomain(),
  ),
  learningPathDomain: getEnvironmentVariabel(
    'LEARNINGPATH_DOMAIN',
    learningPathDomain(),
  ),
  googleTagManagerId: getEnvironmentVariabel('NDLA_GOOGLE_TAG_MANAGER_ID'),
  gaTrackingId: getEnvironmentVariabel('GA_TRACKING_ID', gaTrackingId()),
  zendeskWidgetKey: getEnvironmentVariabel('NDLA_ZENDESK_WIDGET_KEY'),
  localGraphQLApi: getEnvironmentVariabel('LOCAL_GRAPHQL_API', false),
  showAllFrontpageSubjects: true,
  feideClientID: getEnvironmentVariabel('FEIDE_CLIENT_ID'),
  feideClientSecret: getEnvironmentVariabel('FEIDE_CLIENT_SECRET'),
  feideDomain: feideDomain(),
  feideEnabled: getEnvironmentVariabel('FEIDE_ENABLED', false),
  matomoUrl: getEnvironmentVariabel('MATOMO_URL', matomoDomain()),
  matomoSiteId: getEnvironmentVariabel('MATOMO_SITE_ID', ''),
};

export function getUniversalConfig() {
  return process.env.BUILD_TARGET === 'server' ||
    process.env.NODE_ENV === 'unittest'
    ? config
    : window.DATA.config;
}

export default getUniversalConfig();
