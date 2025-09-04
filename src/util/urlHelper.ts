/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Location } from "react-router";
import { validContextIdRegExp } from "../constants";
import { supportedLanguages } from "../i18n";

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
