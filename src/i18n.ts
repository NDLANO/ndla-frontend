/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { i18n } from 'i18next';
import { ApolloClient } from '@apollo/client';
//@ts-ignore
import { createApolloLinks } from './util/apiHelpers';
import nb from './messages/messagesNB';
import nn from './messages/messagesNN';
import en from './messages/messagesEN';
import { STORED_LANGUAGE_KEY } from './constants';
import { getDefaultLocale } from './config';
import { LocaleType } from './interfaces';

const supportedLanguages = ['nb', 'nn'];

type LocaleObject = {
  name: string;
  abbreviation: LocaleType;
};

const NB: LocaleObject = {
  name: 'Bokmål',
  abbreviation: 'nb',
};
const NN: LocaleObject = {
  name: 'Nynorsk',
  abbreviation: 'nn',
};

const EN: LocaleObject = {
  name: 'English',
  abbreviation: 'en',
};

export const appLocales = [NB, NN, EN];
export const preferredLocales = [NB, NN];

export const getLocaleObject = (localeAbbreviation?: string): LocaleObject => {
  const locale = appLocales.find(l => l.abbreviation === localeAbbreviation);

  return locale || NB; // defaults to NB
};

export const isValidLocale = (
  localeAbbreviation?: string,
): localeAbbreviation is LocaleType =>
  appLocales.find(l => l.abbreviation === localeAbbreviation) !== undefined;

export const getHtmlLang = (localeAbbreviation?: string): string => {
  const locale = appLocales.find(l => l.abbreviation === localeAbbreviation);
  return locale?.abbreviation ?? getDefaultLocale();
};

interface RetType extends LocaleObject {
  basepath: string;
  basename: string;
}

export const getLocaleInfoFromPath = (path: string): RetType => {
  const paths = path.split('/');
  const basename = paths[1] && isValidLocale(paths[1]) ? paths[1] : '';
  const basepath = basename ? path.replace(`/${basename}`, '') : path;
  return {
    basepath,
    basename,
    ...getLocaleObject(basename),
  };
};

export const initializeI18n = (
  i18n: i18n,
  client?: ApolloClient<object>,
  cookieString?: string,
): void => {
  i18n.options.supportedLngs = supportedLanguages;
  i18n.addResourceBundle('en', 'translation', en, false, false);
  i18n.addResourceBundle('nb', 'translation', nb, false, false);
  i18n.addResourceBundle('nn', 'translation', nn, false, false);

  i18n.on('languageChanged', function(language) {
    if (typeof document != 'undefined') {
      document.documentElement.lang = language;
    }
    if (typeof window != 'undefined') {
      if (client) {
        client.resetStore();
        client.setLink(createApolloLinks(language, cookieString));
      }
      window.localStorage.setItem(STORED_LANGUAGE_KEY, language);
    }
  });
};
