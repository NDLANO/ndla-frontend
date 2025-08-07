/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { matchPath, Params, Location } from "react-router-dom";
import { validContextIdRegExp } from "../constants";
import { isValidLocale, supportedLanguages } from "../i18n";
import { oembedRoutes } from "../routes";
import log from "./logger";

type OembedReturnParams =
  | "subjectId"
  | "topicId"
  | "resourceId"
  | "contextId"
  | "articleId"
  | "nodeId"
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

const SUBJECT_REGEX = /^subject:(\d+:)?[a-z\-0-9]+$/;
const RESOURCE_REGEX = /^resource:(\d+:)?[a-z\-0-9]+$/;
const TOPIC_REGEX = /^topic:(\d+:)?[a-z\-0-9]+$/;

export function parseOembedUrl(url: string) {
  try {
    const { pathname } = new URL(url);
    const paths = pathname.split("/");
    if (paths[1]) {
      paths[1] = paths[1] === "unknown" ? "nb" : paths[1];
    }
    if (paths.includes("subjects")) {
      paths.splice(paths.indexOf("subjects"), 1);
    }
    const path = paths.join("/");

    if (path.includes("/subject:")) {
      const params: Partial<Record<OembedReturnParams, string>> = {};
      // Remove empty string caused by leading slash
      paths.shift();
      const locale = isValidLocale(paths[0]) ? paths.shift() : undefined;
      params.lang = locale;
      const subjectId = paths.shift();
      if (!subjectId || !SUBJECT_REGEX.test(subjectId)) return undefined;
      params.subjectId = `urn:${subjectId}`;

      let valid = true;
      for (const p of paths) {
        if (RESOURCE_REGEX.test(p)) {
          params.resourceId = `urn:${p}`;
        } else if (TOPIC_REGEX.test(p)) {
          params.topicId = `urn:${p}`;
        } else {
          valid = false;
          break;
        }
      }
      return valid && params.subjectId && (params.resourceId || params.topicId)
        ? (params as Params<OembedReturnParams>)
        : undefined;
    }

    return matchRoute<OembedReturnParams>(path, oembedRoutes, isValidLocale(paths[1]));
  } catch (error) {
    log.warn(`Error parsing oEmbed URL '${url}'`, error, { url });
    return;
  }
}

export const toHref = (location: Location) => {
  return `${location.pathname}${location.search}`;
};

const LANGUAGE_REGEXP = new RegExp(`^\\/(${supportedLanguages.join("|")})($|\\/)`, "");

export const constructNewPath = (pathname: string, newLocale?: string) => {
  const path = pathname.replace(LANGUAGE_REGEXP, "");
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  const localePrefix = newLocale ? `/${newLocale}` : "";
  return `${localePrefix}${fullPath}`;
};

export const isValidContextId = (id?: string) => validContextIdRegExp.test(id ?? "");

export const URL_REGEX =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zæøåA-ZÆØÅ0-9()@:%_\\+.~#?&\\/=]*)$/;
