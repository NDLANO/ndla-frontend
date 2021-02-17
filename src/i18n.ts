/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { formatNestedMessages } from '@ndla/i18n';
// @ts-ignore
import { messagesNB, messagesEN, messagesNN } from '@ndla/ui';
import additionalMessagesNB from './messages/messagesNB';
import additionalMessagesNN from './messages/messagesNN';
import additionalMessagesEN from './messages/messagesEN';

type LocaleObject = {
  name: string;
  abbreviation: string;
  messages: {
    [key: string]: string;
  };
};

const NB: LocaleObject = {
  name: 'Bokmål',
  abbreviation: 'nb',
  messages: formatNestedMessages({ ...messagesNB, ...additionalMessagesNB }),
};
const NN: LocaleObject = {
  name: 'Nynorsk',
  abbreviation: 'nn',
  messages: formatNestedMessages({ ...messagesNN, ...additionalMessagesNN }),
};
const EN: LocaleObject = {
  name: 'English',
  abbreviation: 'en',
  messages: formatNestedMessages({ ...messagesEN, ...additionalMessagesEN }),
};

export const appLocales = [NB, NN, EN];
export const preferredLocales = [NB, NN];

export const getLocaleObject = (localeAbbreviation?: string): LocaleObject => {
  const locale = appLocales.find(l => l.abbreviation === localeAbbreviation);

  return locale || NB; // defaults to NB
};

export const isValidLocale = (localeAbbreviation?: string): boolean =>
  appLocales.find(l => l.abbreviation === localeAbbreviation) !== undefined;

export const getHtmlLang = (localeAbbreviation?: string): string => {
  const locale = appLocales.find(l => l.abbreviation === localeAbbreviation);
  return locale ? locale.abbreviation : 'nb'; // Defaults to nb if not found
};

interface RetType extends LocaleObject {
  basepath: string;
  basename?: string;
}

export const getLocaleInfoFromPath = (path: string): RetType => {
  const paths = path.split('/');
  const basename = isValidLocale(paths[1]) ? paths[1] : '';
  const basepath = basename ? path.replace(`/${basename}`, '') : path;
  return {
    basepath,
    basename,
    ...getLocaleObject(basename),
  };
};
