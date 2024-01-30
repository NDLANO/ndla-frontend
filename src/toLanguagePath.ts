/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isValidLocale } from './i18n';
import { constructNewPath } from './util/urlHelper';

export const toLanguagePath = (path: string, language?: string) => {
  if (language === 'nb' || !isValidLocale(language)) {
    return path;
  } else if (!path.startsWith('/')) {
    return `/${language}/${path}`;
  } else return constructNewPath(path, language);
};
