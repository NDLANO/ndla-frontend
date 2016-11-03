/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getLocaleObject, isValidLocale, formatNestedMessages } from '../i18n';

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
