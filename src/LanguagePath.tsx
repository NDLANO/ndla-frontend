/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { useVersionHash } from './components/VersionHashContext';
import config from './config';
import { LocaleType } from './interfaces';
import { createApolloLinks } from './util/apiHelpers';

export const LanguagePath = () => {
  const { i18n } = useTranslation();
  const { lang } = useParams();
  const client = useApolloClient();
  const versionHash = useVersionHash();

  useEffect(() => {
    if (
      (!lang && i18n.language !== config.defaultLocale) ||
      (lang && i18n.language !== lang)
    ) {
      i18n.changeLanguage(lang as LocaleType);
    }
  }, [i18n, lang]);

  i18n.on('languageChanged', (lang) => {
    client.resetStore();
    client.setLink(createApolloLinks(lang, versionHash));
    document.documentElement.lang = lang;
  });

  return null;
};
