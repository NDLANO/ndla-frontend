/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Location } from "react-router-dom";
import { preferredLocales } from "../i18n";
import { LocaleType } from "../interfaces";

const getLocaleURL = (newLocale: LocaleType, locale: LocaleType, location: Omit<Location, "key" | "state">) => {
  const { pathname, search } = location;
  const basePath = pathname.startsWith(`/${locale}/`) ? pathname.replace(`/${locale}/`, "/") : pathname;
  return newLocale === "nb" ? `${basePath}${search}` : `/${newLocale}${basePath}${search}`;
};

type LocaleUrls = Record<string, { name: string; url: string }>;

export const getLocaleUrls = (locale: LocaleType, location: Omit<Location, "key" | "state">): LocaleUrls => {
  return preferredLocales.reduce<LocaleUrls>((prev, curr) => {
    const localeUrl = getLocaleURL(curr.abbreviation, locale, location);
    const abb = curr.abbreviation;
    const url = abb === "nb" ? `/${abb}${localeUrl}` : localeUrl;
    return { ...prev, [curr.abbreviation]: { name: curr.name, url } };
  }, {});
};
