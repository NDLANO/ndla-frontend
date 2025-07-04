/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

type RuntimeType = "test" | "development" | "production";

export function getEnvironmentVariabel(key: string, fallback: string): string;
export function getEnvironmentVariabel(key: string, fallback: boolean): boolean;
export function getEnvironmentVariabel(key: string, fallback?: string): string | undefined;
export function getEnvironmentVariabel(key: string, fallback?: string | boolean): string | boolean | undefined {
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

const learningPathDomain = (ndlaEnvironment: string): string => {
  const ndlaEnvironmentHostname = ndlaEnvironment.replace("_", "-");
  switch (ndlaEnvironment) {
    case "local":
      return "http://localhost:30007";
    case "dev":
      return "https://stier.test.ndla.no";
    case "prod":
      return "https://stier.ndla.no";
    default:
      return `https://stier.${ndlaEnvironmentHostname}.ndla.no`;
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
  learningPathDomain: string;
  zendeskWidgetKey: string | undefined;
  localGraphQLApi: boolean;
  feideDomain: string;
  matomoUrl: string;
  matomoSiteId: string;
  matomoTagmanagerId: string;
  isVercel: boolean;
  monsidoToken: string;
  runtimeType: RuntimeType;
  isClient: boolean;
  debugGraphQLCache: boolean;
  sentrydsn: string;
  formbricksId: string;
  arenaDomain: string;
  autologinCookieEnabled: boolean;
  loginHint: string | undefined;
  gracePeriodSeconds: number;
};

const getServerSideConfig = (): ConfigType => {
  const ndlaEnvironment = getEnvironmentVariabel("NDLA_ENVIRONMENT", "dev");
  return {
    defaultLocale: getEnvironmentVariabel("NDLA_DEFAULT_LOCALE", "nb"),
    componentName: "ndla-frontend",
    componentVersion: getEnvironmentVariabel("COMPONENT_VERSION") ?? "SNAPSHOT",
    ndlaEnvironment,
    host: getEnvironmentVariabel("NDLA_FRONTEND_HOST", "localhost"),
    port: getEnvironmentVariabel("NDLA_FRONTEND_PORT", "3000"),
    redirectPort: getEnvironmentVariabel("NDLA_REDIRECT_PORT", "3001"),
    logEnvironment: getEnvironmentVariabel("NDLA_ENVIRONMENT", "local"),
    disableSSR: getEnvironmentVariabel("DISABLE_SSR", false),
    isNdlaProdEnvironment: ndlaEnvironment === "prod",
    ndlaApiUrl: getEnvironmentVariabel("NDLA_API_URL", apiDomain(ndlaEnvironment)),
    ndlaFrontendDomain: getEnvironmentVariabel("FRONTEND_DOMAIN", ndlaFrontendDomain(ndlaEnvironment)),
    learningPathDomain: getEnvironmentVariabel("LEARNINGPATH_DOMAIN", learningPathDomain(ndlaEnvironment)),
    zendeskWidgetKey: getEnvironmentVariabel("NDLA_ZENDESK_WIDGET_KEY"),
    localGraphQLApi: getEnvironmentVariabel("LOCAL_GRAPHQL_API", false),
    feideDomain: getEnvironmentVariabel("FEIDE_DOMAIN", feideDomain(ndlaEnvironment)),
    matomoUrl: getEnvironmentVariabel("MATOMO_URL", "https://tall.ndla.no"),
    matomoSiteId: getEnvironmentVariabel("MATOMO_SITE_ID", ""),
    matomoTagmanagerId: getEnvironmentVariabel("MATOMO_TAGMANAGER_ID", ""),
    isVercel: getEnvironmentVariabel("IS_VERCEL", false),
    monsidoToken: getEnvironmentVariabel("MONSIDO_TOKEN", ""),
    runtimeType: getEnvironmentVariabel("NODE_ENV", "development") as RuntimeType,
    isClient: false,
    debugGraphQLCache: getEnvironmentVariabel("DEBUG_GRAPHQL_CACHE", false),
    sentrydsn: getEnvironmentVariabel(
      "SENTRY_DSN",
      "https://0058e1cbf3df96a365c7afefee29b665@o4508018773524480.ingest.de.sentry.io/4508018776735824",
    ),
    formbricksId: getEnvironmentVariabel("FORMBRICKS_ID", ""),
    arenaDomain: getEnvironmentVariabel("ARENA_DOMAIN", arenaDomain(ndlaEnvironment)),
    autologinCookieEnabled: getEnvironmentVariabel("AUTOLOGIN_COOKIE_ENABLED", false),
    loginHint: loginHint(ndlaEnvironment, getEnvironmentVariabel("AUTOLOGIN_COOKIE_ENABLED", false)),
    gracePeriodSeconds: parseInt(getEnvironmentVariabel("READINESS_PROBE_DETECTION_SECONDS", "7")),
  };
};

export function getUniversalConfig() {
  if (typeof window === "undefined" || process.env.NODE_ENV === "test") {
    return getServerSideConfig();
  }

  return window.DATA.config;
}

export default getUniversalConfig();
