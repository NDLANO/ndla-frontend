/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { preferredLocales } from '../i18n';

const getLocaleURL = (newLocale, locale, location) => {
  const { pathname, search } = location;
  const basePath = pathname.startsWith(`/${locale}/`)
    ? pathname.replace(`/${locale}/`, '/')
    : pathname;
  return newLocale === 'nb'
    ? `${basePath}${search}`
    : `/${newLocale}${basePath}${search}`;
};

export const getLocaleUrls = (locale, location) => {
  const localeUrls = {};
  preferredLocales.forEach(appLocale => {
    localeUrls[appLocale.abbreviation] = {
      name: appLocale.name,
      url:
        appLocale.abbreviation === 'nb'
          ? `/${appLocale.abbreviation}${getLocaleURL(
              appLocale.abbreviation,
              locale,
              location,
            )}`
          : getLocaleURL(appLocale.abbreviation, locale, location),
    };
  });
  return localeUrls;
};
