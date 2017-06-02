/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import { preferdLocales } from '../i18n';

export const findFallbackTranslation = translations => {
  const locale = preferdLocales.find(l =>
    translations.find(t => t.language === l.abbreviation),
  );
  if (!locale && translations.length > 0) {
    return translations[0];
  }

  return translations.find(t => t.language === locale.abbreviation);
};

const createFieldByLanguageFinder = (fieldName, propName) => (
  obj,
  lang,
  withFallback = false,
) => {
  const translations = defined(defined(obj, {})[fieldName], []);
  const translation = defined(
    translations.find(d => d.language === lang),
    withFallback ? findFallbackTranslation(translations) : {},
    {},
  );
  return translation[defined(propName, fieldName)];
};

export default createFieldByLanguageFinder;
