/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import polyglot from '../i18n';
import { availableLocales, NB } from './localeConstants';

export const configureLocale = (localeAbbreviation) => {
  const locale = availableLocales.find(l => l.abbreviation === localeAbbreviation);

  if (locale) {
    polyglot.locale(locale.abbreviation);
    polyglot.replace(locale.phrases);
    return locale.abbreviation;
  }

  // defaults to NB
  polyglot.locale(NB.abbreviation);
  polyglot.replace(NB.phrases);
  return NB.abbreviation;
};

export const isValidLocale = (localeAbbreviation) => availableLocales.find(l => l.abbreviation === localeAbbreviation) !== undefined;
