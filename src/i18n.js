/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { addLocaleData, intlShape } from 'react-intl';

import Polyglot from 'node-polyglot';
import enLocaleData from 'react-intl/locale-data/en';
import nbLocaleData from 'react-intl/locale-data/nb';

import nb from './phrases/phrases-nb';
import en from './phrases/phrases-en';


addLocaleData(enLocaleData);
addLocaleData(nbLocaleData);

export const appLocales = [
  'en',
  'nb',
  'nn',
];


export const formatTranslationMessages = (messages) => {
  const formattedMessages = {};
  for (const message of messages) {
    formattedMessages[message.id] = message.message || message.defaultMessage;
  }

  return formattedMessages;
};

function* entries(obj) {
  for (const key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

export const formatNestedTranslationMessages = (phrases, formattedMessages = {}, prefix = '') => {
  const messages = formattedMessages;
  for (const [key, value] of entries(phrases)) {
    if ({}.hasOwnProperty.call(phrases, key)) {
      const keyWithPrefix = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object') {
        formatNestedTranslationMessages(value, formattedMessages, keyWithPrefix);
      } else {
        messages[keyWithPrefix] = value;
      }
    }
  }
  return messages;
};


function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

export const injectT = (WrappedComponent) => {
  const InjectT = (props, context) => <WrappedComponent {...props} t={(id) => context.intl.formatMessage({ id })} />;

  InjectT.contextTypes = {
    intl: intlShape,
  };

  InjectT.displayName = `InjectT(${getDisplayName(WrappedComponent)})`;

  return InjectT;
};

export const translationMessages = {
  en: formatNestedTranslationMessages(en),
  nb: formatNestedTranslationMessages(nb),
};

export default new Polyglot({ locale: 'nb', nb });
