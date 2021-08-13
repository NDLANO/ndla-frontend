/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteComponentProps } from 'react-router-dom';
import { LocaleType } from '../interfaces';
import { preferredLocales } from '../i18n';

const getLocaleURL = (
  newLocale: LocaleType,
  locale: LocaleType,
  location: RouteComponentProps['location'],
) => {
  const { pathname, search } = location;
  const basePath = pathname.startsWith(`/${locale}/`)
    ? pathname.replace(`/${locale}/`, '/')
    : pathname;
  return newLocale === 'nb'
    ? `${basePath}${search}`
    : `/${newLocale}${basePath}${search}`;
};

type LocaleUrls = Record<LocaleType, { name: string; url: string }>;

export const getLocaleUrls = (
  locale: LocaleType,
  location: RouteComponentProps['location'],
) => {
  const localeUrls = {} as LocaleUrls;
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
