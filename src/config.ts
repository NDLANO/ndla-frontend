/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { LocaleType } from "./interfaces";

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

const logglyApiKey = (): string | undefined => {
  if (process.env.NODE_ENV === "test") {
    return "";
  }
  return getEnvironmentVariabel("LOGGLY_API_KEY");
};

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
  zendeskWidgetKey: string | undefined;
  localGraphQLApi: boolean;
  saamiEnabled: boolean;
  feideDomain: string;
  feideEnabled: boolean;
  matomoUrl: string;
  matomoSiteId: string;
  matomoTagmanagerId: string;
  isVercel: boolean;
  monsidoToken: string;
  arenaModeratorGroup: string;
  arenaAdminGroup: string;
  enableNodeBB: boolean;
  runtimeType: RuntimeType;
  isClient: boolean;
  folderRedesign: boolean;
};

const getServerSideConfig = (): ConfigType => {
  const ndlaEnvironment = getEnvironmentVariabel("NDLA_ENVIRONMENT", "dev");
  return {
    defaultLocale: getEnvironmentVariabel("NDLA_DEFAULT_LOCALE", "nb") as LocaleType,
    componentName: "ndla-frontend",
    ndlaEnvironment,
    host: getEnvironmentVariabel("NDLA_FRONTEND_HOST", "localhost"),
    port: getEnvironmentVariabel("NDLA_FRONTEND_PORT", "3000"),
    redirectPort: getEnvironmentVariabel("NDLA_REDIRECT_PORT", "3001"),
    logEnvironment: getEnvironmentVariabel("NDLA_ENVIRONMENT", "local"),
    logglyApiKey: logglyApiKey(),
    disableSSR: getEnvironmentVariabel("DISABLE_SSR", false),
    isNdlaProdEnvironment: ndlaEnvironment === "prod",
    ndlaApiUrl: getEnvironmentVariabel("NDLA_API_URL", apiDomain(ndlaEnvironment)),
    ndlaFrontendDomain: getEnvironmentVariabel("FRONTEND_DOMAIN", ndlaFrontendDomain(ndlaEnvironment)),
    learningPathDomain: getEnvironmentVariabel("LEARNINGPATH_DOMAIN", learningPathDomain(ndlaEnvironment)),
    zendeskWidgetKey: getEnvironmentVariabel("NDLA_ZENDESK_WIDGET_KEY"),
    localGraphQLApi: getEnvironmentVariabel("LOCAL_GRAPHQL_API", false),
    saamiEnabled: getEnvironmentVariabel("SAAMI_ENABLED", false),
    feideDomain: feideDomain(ndlaEnvironment),
    feideEnabled: getEnvironmentVariabel("FEIDE_ENABLED", false),
    matomoUrl: getEnvironmentVariabel("MATOMO_URL", "https://tall.ndla.no"),
    matomoSiteId: getEnvironmentVariabel("MATOMO_SITE_ID", ""),
    matomoTagmanagerId: getEnvironmentVariabel("MATOMO_TAGMANAGER_ID", ""),
    isVercel: getEnvironmentVariabel("IS_VERCEL", false),
    monsidoToken: getEnvironmentVariabel("MONSIDO_TOKEN", ""),
    arenaModeratorGroup: getEnvironmentVariabel("ARENA_MODERATOR_GROUP", "Global Moderators"),
    arenaAdminGroup: getEnvironmentVariabel("ARENA_ADMIN_GROUP", "ADMIN"),
    enableNodeBB: getEnvironmentVariabel("ENABLE_NODEBB", false),
    runtimeType: getEnvironmentVariabel("NODE_ENV", "development") as RuntimeType,
    isClient: false,
    folderRedesign: getEnvironmentVariabel("FOLDER_REDESIGN", true),
  };
};

export function getUniversalConfig() {
  if (typeof window === "undefined" || process.env.NODE_ENV === "test") {
    return getServerSideConfig();
  }

  return window.DATA.config;
}

export default getUniversalConfig();
