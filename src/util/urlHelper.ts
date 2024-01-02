/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { matchPath, Params, PathMatch, Location } from "react-router-dom";
import { isValidLocale, supportedLanguages } from "../i18n";
import { oembedRoutes } from "../routes";

type OembedParams =
  | "subjectId"
  | "topicId"
  | "resourceId"
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
  | "articleId"
  | "lang"
  | "audioId"
  | "videoId"
  | "imageId"
  | "conceptId"
  | "h5pId";

const matchUrl = (pathname: string, lang: boolean = false): PathMatch<OembedReturnParams> | null => {
  const possiblePaths = lang ? oembedRoutes.map((r) => `/:lang/${r}`) : oembedRoutes;

  let match: PathMatch<OembedParams> | undefined;
  for (let i = 0; i < possiblePaths.length; i++) {
    const attempt = possiblePaths[i] ?? "";
    const m = matchPath<OembedParams, string>(attempt, pathname);
    if (m) {
      match = m;
      break;
    }
  }
  if (!match) {
    return null;
  }

  if (match.params.topicOrResourceId) {
    const missingParam: {
      resourceId?: string;
      topicId?: string;
    } = match.params.topicOrResourceId.startsWith(":resource")
      ? { resourceId: match.params.topicOrResourceId.replace(":resource", "") }
      : { topicId: match.params.topicOrResourceId.replace(":topic", "") };
    const params: Params<OembedParams> = match.params;
    return {
      ...match,
      params: {
        ...params,
        ...missingParam,
      },
    };
  } else return match;
};

export function parseOembedUrl(url: string, ignoreLocale: boolean = false) {
  const { pathname } = new URL(url);
  const paths = pathname.split("/");
  if (paths[1]) {
    paths[1] = paths[1] === "unknown" ? "nb" : paths[1];
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
