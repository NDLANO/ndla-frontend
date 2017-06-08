/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { addLocaleData, intlShape } from 'react-intl';

import enLocaleData from 'react-intl/locale-data/en';
import nbLocaleData from 'react-intl/locale-data/nb';
import nnLocaleData from 'react-intl/locale-data/nn';

import nb from './phrases/phrases-nb';
import en from './phrases/phrases-en';

addLocaleData([...nbLocaleData, ...nnLocaleData, ...enLocaleData]);

function* entries(obj) {
  // eslint-disable-next-line
  for (const key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

export const formatNestedMessages = (
  phrases,
  formattedMessages = {},
  prefix = '',
) => {
  const messages = formattedMessages;

  // eslint-disable-next-line
  for (const [key, value] of entries(phrases)) {
    if ({}.hasOwnProperty.call(phrases, key)) {
      const keyWithPrefix = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object') {
        formatNestedMessages(value, formattedMessages, keyWithPrefix);
      } else {
        messages[keyWithPrefix] = value;
      }
    }
  }
  return messages;
};

const NB = {
  name: 'Bokmål',
  abbreviation: 'nb',
  messages: formatNestedMessages(nb),
};
const NN = {
  name: 'Nynorsk',
  abbreviation: 'nn',
  messages: formatNestedMessages(nb),
};
const EN = {
  name: 'English',
  abbreviation: 'en',
  messages: formatNestedMessages(en),
};

export const appLocales = [NB, NN, EN];
export const preferdLocales = [NB, NN, EN];

export const getLocaleObject = localeAbbreviation => {
  const locale = appLocales.find(l => l.abbreviation === localeAbbreviation);

  return locale || NB; // defaults to NB
};

export const isValidLocale = localeAbbreviation =>
  appLocales.find(l => l.abbreviation === localeAbbreviation) !== undefined;

export const getHtmlLang = localeAbbreviation => {
  const locale = appLocales.find(l => l.abbreviation === localeAbbreviation);
  return locale ? locale.abbreviation : 'nb'; // Defaults to nb if not found
};

export const injectT = WrappedComponent => {
  function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
  }

  const InjectT = (props, context) =>
    <WrappedComponent
      {...props}
      t={(id, value = {}) => context.intl.formatMessage({ id }, value)}
    />;

  InjectT.contextTypes = {
    intl: intlShape,
  };

  InjectT.displayName = `InjectT(${getDisplayName(WrappedComponent)})`;

  return InjectT;
};

export default injectT;
