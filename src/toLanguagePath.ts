/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from './config';
import { supportedLanguages } from './i18n';
import { LocaleType } from './interfaces';
import { constructNewPath } from './util/urlHelper';

export const toLanguagePath = (path: string, language?: string) =>
  language === config.defaultLocale
    ? constructNewPath(path)
    : constructNewPath(
        path,
        supportedLanguages.includes(language as LocaleType) ? language : 'en',
      );
