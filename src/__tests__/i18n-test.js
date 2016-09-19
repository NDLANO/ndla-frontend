/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';

import { getLocaleObject, isValidLocale, formatNestedMessages } from '../i18n';

test('i18n getLocaleObject()', t => {
  t.is(getLocaleObject('en').abbreviation, 'en');
  t.is(getLocaleObject('en').messages['footer.aboutNDLA'], 'About NDLA');

  t.is(getLocaleObject('nb').abbreviation, 'nb');
  t.is(getLocaleObject('nb').messages['footer.aboutNDLA'], 'Om NDLA');

  // Defaults to nb if locale not found
  t.is(getLocaleObject('ru').abbreviation, 'nb');
  t.is(getLocaleObject('ru').messages['footer.aboutNDLA'], 'Om NDLA');
});

test('i18n isValidLocale()', t => {
  t.is(isValidLocale('nb'), true);
  t.is(isValidLocale('nn'), true);
  t.is(isValidLocale('en'), true);
  t.is(isValidLocale('aa'), false);
  t.is(isValidLocale('ub'), false);
});

test('i18n formatNestedMessages()', t => {
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

  t.is(messages.helloworld, 'Hello world');
  t.is(messages['test.Me'], 'Test Me');
  t.is(messages['welcome.to.my.unittest'], 'Welcome to my unittest');
});
