/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  getLocaleObject,
  isValidLocale,
  formatNestedMessages,
  getLocaleInfoFromPath,
} from '../i18n';

test('i18n getLocaleObject()', () => {
  expect(getLocaleObject('en').abbreviation).toBe('en');
  expect(getLocaleObject('en').messages['footer.aboutNDLA']).toBe('About NDLA');

  expect(getLocaleObject('nb').abbreviation).toBe('nb');
  expect(getLocaleObject('nb').messages['footer.aboutNDLA']).toBe('Om NDLA');

  // Defaults to nb if locale not found
  expect(getLocaleObject('ru').abbreviation).toBe('nb');
  expect(getLocaleObject('ru').messages['footer.aboutNDLA']).toBe('Om NDLA');
});

test('i18n isValidLocale()', () => {
  expect(isValidLocale('nb')).toBe(true);
  expect(isValidLocale('nn')).toBe(true);
  expect(isValidLocale('en')).toBe(true);
  expect(isValidLocale('aa')).toBe(false);
  expect(isValidLocale('ub')).toBe(false);
});

test('i18n formatNestedMessages()', () => {
  const messages = formatNestedMessages({
    helloworld: 'Hello world',
    test: {
      Me: 'Test Me',
    },
    welcome: {
      to: {
        my: {
          unittest: 'Welcome to my unittest',
        },
      },
    },
  });

  expect(messages.helloworld).toBe('Hello world');
  expect(messages['test.Me']).toBe('Test Me');
  expect(messages['welcome.to.my.unittest']).toBe('Welcome to my unittest');
});

test('i18n getLocaleInfoFromPath', () => {
  expect(getLocaleInfoFromPath('/nb/subjects/').basepath).toBe('/subjects/');
  expect(getLocaleInfoFromPath('/nb/subjects/').basename).toBe('nb');

  expect(getLocaleInfoFromPath('/nn/subjects/').basepath).toBe('/subjects/');
  expect(getLocaleInfoFromPath('/nn/subjects/').basename).toBe('nn');

  expect(getLocaleInfoFromPath('/en/subjects/').basepath).toBe('/subjects/');
  expect(getLocaleInfoFromPath('/en/subjects/').basename).toBe('en');

  expect(getLocaleInfoFromPath('/subjects/').basepath).toBe('/subjects/');
  expect(getLocaleInfoFromPath('/subjects/').basename).toBe('');
});
