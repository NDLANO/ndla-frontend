/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IS_CLIENT, IS_TEST } from "./buildConfig";

export function getEnvironmentVariable(key: string, fallback: string): string;
export function getEnvironmentVariable(key: string, fallback: boolean): boolean;
export function getEnvironmentVariable(key: string, fallback?: string): string | undefined;
export function getEnvironmentVariable(key: string, fallback?: string | boolean): string | boolean | undefined {
  const env = "env";
  const variableValue = process[env][key]; // Hack to prevent DefinePlugin replacing process.env
  if (typeof fallback === "boolean") {
    return variableValue ? variableValue.toLowerCase() === "true" : fallback;
  }

  return variableValue || fallback;
}

const apiDomain = (ndlaEnvironment: string): string => {
  const ndlaEnvironmentHostname = ndlaEnvironment.replace("_", "-");
  switch (ndlaEnvironment) {
    case "local":
      return "http://api-gateway.ndla-local";
    case "dev":
      return "https://api.test.ndla.no";
    case "prod":
      return "https://api.ndla.no";
    default:
      return `https://api.${ndlaEnvironmentHostname}.ndla.no`;
  }
};

const ndlaFrontendDomain = (ndlaEnvironment: string): string => {
  const ndlaEnvironmentHostname = ndlaEnvironment.replace("_", "-");
  switch (ndlaEnvironment) {
    case "local":
      return "http://localhost:30017";
    case "dev":
      return "https://test.ndla.no";
    case "prod":
      return "https://ndla.no";
    default:
      return `https://${ndlaEnvironmentHostname}.ndla.no`;
  }
};

export const arenaDomain = (ndlaEnvironment: string): string => {
  const ndlaEnvironmentHostname = ndlaEnvironment.replace("_", "-");
  switch (ndlaEnvironment) {
    case "dev":
    case "local":
      return "arena.test.ndla.no";
    case "prod":
      return "arena.ndla.no";
    default:
      return `arena.${ndlaEnvironmentHostname}.ndla.no`;
  }
};

export const feideDomain = (ndlaEnvironment: string): string => {
  const ndlaEnvironmentHostname = ndlaEnvironment.replace("_", "-");
  switch (ndlaEnvironment) {
    case "local":
    case "dev":
      return "localhost";
    case "prod":
      return "ndla.no";
    default:
      return `${ndlaEnvironmentHostname}.ndla.no`;
  }
};

const loginHint = (ndlaEnvironment: string, autologinCookieEnabled: boolean): string | undefined => {
  if (!autologinCookieEnabled) return undefined;
  switch (ndlaEnvironment) {
    case "local":
    case "dev":
      return undefined;
    default:
      return "feide|all";
  }
};

export type ConfigType = {
  defaultLocale: string;
  componentName: string;
  componentVersion: string;
  ndlaEnvironment: string;
  host: string;
  port: string;
  redirectPort: string;
  logEnvironment: string;
  disableSSR: boolean;
  isNdlaProdEnvironment: boolean;
  ndlaApiUrl: string;
  ndlaFrontendDomain: string;
  zendeskWidgetKey: string | undefined;
  localGraphQLApi: boolean;
  feideDomain: string;
  matomoUrl: string;
  matomoSiteId: string;
  matomoTagmanagerId: string;
  isVercel: boolean;
  monsidoToken: string;
  sentrydsn: string;
  formbricksId: string;
  arenaDomain: string;
  autologinCookieEnabled: boolean;
  loginHint: string | undefined;
  gracePeriodSeconds: number;
  allResourceTypesEnabled: boolean;
};

const getServerSideConfig = (): ConfigType => {
  const ndlaEnvironment = getEnvironmentVariable("NDLA_ENVIRONMENT", "dev");
  return {
    defaultLocale: getEnvironmentVariable("NDLA_DEFAULT_LOCALE", "nb"),
    componentName: "ndla-frontend",
    componentVersion: getEnvironmentVariable("COMPONENT_VERSION") ?? "SNAPSHOT",
    ndlaEnvironment,
    host: getEnvironmentVariable("NDLA_FRONTEND_HOST", "localhost"),
    port: getEnvironmentVariable("NDLA_FRONTEND_PORT", "3000"),
    redirectPort: getEnvironmentVariable("NDLA_REDIRECT_PORT", "3001"),
    logEnvironment: getEnvironmentVariable("NDLA_ENVIRONMENT", "local"),
    disableSSR: getEnvironmentVariable("DISABLE_SSR", false),
    isNdlaProdEnvironment: ndlaEnvironment === "prod",
    ndlaApiUrl: getEnvironmentVariable("NDLA_API_URL", apiDomain(ndlaEnvironment)),
    ndlaFrontendDomain: getEnvironmentVariable("FRONTEND_DOMAIN", ndlaFrontendDomain(ndlaEnvironment)),
    zendeskWidgetKey: getEnvironmentVariable("NDLA_ZENDESK_WIDGET_KEY"),
    localGraphQLApi: getEnvironmentVariable("LOCAL_GRAPHQL_API", false),
    feideDomain: getEnvironmentVariable("FEIDE_DOMAIN", feideDomain(ndlaEnvironment)),
    matomoUrl: getEnvironmentVariable("MATOMO_URL", "https://tall.ndla.no"),
    matomoSiteId: getEnvironmentVariable("MATOMO_SITE_ID", ""),
    matomoTagmanagerId: getEnvironmentVariable("MATOMO_TAGMANAGER_ID", ""),
    isVercel: getEnvironmentVariable("IS_VERCEL", false),
    monsidoToken: getEnvironmentVariable("MONSIDO_TOKEN", ""),
    sentrydsn: getEnvironmentVariable(
      "SENTRY_DSN",
      "https://0058e1cbf3df96a365c7afefee29b665@o4508018773524480.ingest.de.sentry.io/4508018776735824",
    ),
    formbricksId: getEnvironmentVariable("FORMBRICKS_ID", ""),
    arenaDomain: getEnvironmentVariable("ARENA_DOMAIN", arenaDomain(ndlaEnvironment)),
    autologinCookieEnabled: getEnvironmentVariable("AUTOLOGIN_COOKIE_ENABLED", false),
    loginHint: loginHint(ndlaEnvironment, getEnvironmentVariable("AUTOLOGIN_COOKIE_ENABLED", false)),
    gracePeriodSeconds: parseInt(getEnvironmentVariable("READINESS_PROBE_DETECTION_SECONDS", "7")),
    allResourceTypesEnabled: getEnvironmentVariable("ALL_RESOURCE_TYPES_ENABLED", false),
  };
};

export const config = !IS_CLIENT || IS_TEST ? getServerSideConfig() : window.DATA.config;
export default config;
