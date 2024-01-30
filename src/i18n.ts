/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as datefnslocale from 'date-fns/locale';
import { i18n } from 'i18next';
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

export const initializeI18n = (i18n: i18n, language: string): i18n => {
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
