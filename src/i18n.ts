/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as datefnslocale from 'date-fns/locale';
import i18n, { i18n as i18nType } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import {
  messagesEN,
  messagesNB,
  messagesNN,
  messagesSE,
  messagesSMA,
} from '@ndla/ui';
import config, { getDefaultLocale } from './config';
import { LocaleType } from './interfaces';
import en from './messages/messagesEN';
import nb from './messages/messagesNB';
import nn from './messages/messagesNN';
import se from './messages/messagesSE';

export const supportedLanguages: LocaleType[] = config.saamiEnabled
  ? ['nb', 'nn', 'en', 'se']
  : ['nb', 'nn', 'en', 'se'];
export const preferredLanguages: LocaleType[] = ['nb', 'nn', 'en', 'se'];

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

const SE: LocaleObject = {
  name: 'Nordsamisk',
  abbreviation: 'se',
};

export const appLocales = [NB, NN, EN, SE];
export const preferredLocales = [NB, NN, SE];

export const getLocaleObject = (localeAbbreviation?: string): LocaleObject => {
  const locale = appLocales.find((l) => l.abbreviation === localeAbbreviation);

  return locale || NB; // defaults to NB
};

export const isValidLocale = (
  localeAbbreviation: string | undefined | null,
): localeAbbreviation is LocaleType =>
  appLocales.find((l) => l.abbreviation === localeAbbreviation) !== undefined;

export const getHtmlLang = (localeAbbreviation?: string): string => {
  const locale = appLocales.find((l) => l.abbreviation === localeAbbreviation);
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
    basepath: basepath.length === 0 ? '/' : basepath,
    basename,
    ...getLocaleObject(basename),
  };
};

const DETECTION_OPTIONS = {
  order: ['path'],
  caches: ['localStorage'],
};

export const supportedTranslationLanguages = [
  'nb',
  'nn',
  'en',
  'se',
  'sma',
] as const;
const i18nInstance = i18n.use(LanguageDetector).use(initReactI18next);

i18nInstance.init({
  compatibilityJSON: 'v3',
  detection: DETECTION_OPTIONS,
  fallbackLng: 'en',
  supportedLngs: supportedTranslationLanguages,
  resources: {
    en: {
      translation: messagesEN,
    },
    nn: {
      translation: messagesNN,
    },
    nb: {
      translation: messagesNB,
    },
    se: {
      translation: messagesSE,
    },
    sma: {
      translation: messagesSMA,
    },
  },
});

export { i18nInstance };

export const initializeI18n = (i18n: i18nType, language: string): i18nType => {
  const instance = i18n.cloneInstance({
    lng: language,
    supportedLngs: preferredLanguages,
  });
  i18n.addResourceBundle('en', 'translation', en, true, true);
  i18n.addResourceBundle('nb', 'translation', nb, true, true);
  i18n.addResourceBundle('nn', 'translation', nn, true, true);
  i18n.addResourceBundle('se', 'translation', se, true, true);
  return instance;
};

export const DateFNSLocales = {
  nn: datefnslocale.nn,
  nb: datefnslocale.nb,
  en: datefnslocale.enGB,
  se: datefnslocale.nb,
};
