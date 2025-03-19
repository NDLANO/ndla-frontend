/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { matchPath, Params, Location } from "react-router-dom";
import { validContextIdRegExp } from "../constants";
import { GQLTaxBase } from "../graphqlTypes";
import { isValidLocale, supportedLanguages } from "../i18n";
import { oembedRoutes, routes } from "../routes";

type OembedParams =
  | "subjectId"
  | "topicId"
  | "resourceId"
  | "stepId"
  | "contextId"
  | "articleId"
  | "lang"
  | "topicOrResourceId"
  | "audioId"
  | "videoId"
  | "imageId"
  | "conceptId"
  | "h5pId";

type OembedReturnParams =
  | "subjectId"
  | "topicId"
  | "resourceId"
  | "stepId"
  | "contextId"
  | "articleId"
  | "lang"
  | "audioId"
  | "videoId"
  | "imageId"
  | "conceptId"
  | "h5pId";

const matchRoute = <ParamKey extends string = string>(
  pathname: string,
  paths: string[],
  lang = false,
): Params<ParamKey> | undefined => {
  const possiblePaths = lang ? paths.map((r) => `/:lang/${r}`) : paths;
  const match = possiblePaths.find((p) => matchPath(p, pathname));
  return match ? matchPath(match, pathname)?.params : undefined;
};

const matchUrl = (pathname: string, lang: boolean = false): Params<OembedReturnParams> | null => {
  const params = matchRoute<OembedParams>(pathname, oembedRoutes, lang);

  if (!params) return null;

  if (params.topicOrResourceId) {
    const missingParam: {
      resourceId?: string;
      topicId?: string;
    } = params.topicOrResourceId.startsWith(":resource")
      ? { resourceId: params.topicOrResourceId.replace(":resource", "") }
      : { topicId: params.topicOrResourceId.replace(":topic", "") };
    const oldParams: Params<OembedParams> = params;
    return {
      ...oldParams,
      ...missingParam,
    };
  } else return params;
};

export function parseOembedUrl(url: string, ignoreLocale: boolean = false) {
  const { pathname } = new URL(url);
  const paths = pathname.split("/");
  if (paths[1]) {
    paths[1] = paths[1] === "unknown" ? "nb" : paths[1];
  }
  if (paths.includes("subjects")) {
    paths.splice(paths.indexOf("subjects"), 1);
  }
  if (ignoreLocale && isValidLocale(paths[1])) {
    paths.splice(1, 1);
  }
  const path = paths.join("/");

  if (isValidLocale(paths[1])) {
    return matchUrl(path, true);
  }
  return matchUrl(path, false);
}

export const toHref = (location: Location) => {
  return `${location.pathname}${location.search}`;
};

export const constructNewPath = (pathname: string, newLocale?: string) => {
  const regex = new RegExp(`\\/(${supportedLanguages.join("|")})($|\\/)`, "");
  const path = pathname.replace(regex, "");
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  const localePrefix = newLocale ? `/${newLocale}` : "";
  return `${localePrefix}${fullPath}`;
};

export const isCurrentPage = (pathname: string, taxBase: Pick<GQLTaxBase, "url">) => {
  let path = pathname.replace(/\/$/, ""); // Remove trailing slash if present
  const params = matchRoute(path, routes);
  if (params?.stepId) {
    path = path.replace(/\/\d+$/, ""); // Remove last numeric segment if stepId
  }
  return decodeURIComponent(path) === taxBase.url;
};

export const isValidContextId = (id?: string) => validContextIdRegExp.test(id ?? "");

export const URL_REGEX =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zæøåA-ZÆØÅ0-9()@:%_\\+.~#?&\\/=]*)$/;
