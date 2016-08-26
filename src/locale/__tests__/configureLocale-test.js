/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';

import { configureLocale, getHtmlLang, isValidLocale } from '../configureLocale';

test.cb.serial('configureLocale configureLocale()', (t) => {
  t.is(configureLocale('en').currentLocale, 'en');
  t.is(configureLocale('en').phrases['footer.aboutNDLA'], 'About NDLA');

  t.is(configureLocale('nb').currentLocale, 'nb');
  t.is(configureLocale('nb').phrases['footer.aboutNDLA'], 'Om NDLA');

  // Defaults to nb if locale not found
  t.is(configureLocale('ru').currentLocale, 'nb');
  t.is(configureLocale('ru').phrases['footer.aboutNDLA'], 'Om NDLA');

  t.end();
});

test.cb.serial('configureLocale isValidLocale()', (t) => {
  t.is(isValidLocale('nb'), true);
  t.is(isValidLocale('nn'), true);
  t.is(isValidLocale('en'), true);
  t.is(isValidLocale('aa'), false);
  t.is(isValidLocale('ub'), false);
  t.end();
});

test.cb.serial('configureLocale getHtmlLang()', (t) => {
  t.is(getHtmlLang('nb'), 'nb');
  t.is(getHtmlLang('nn'), 'nn');
  t.is(getHtmlLang('en'), 'en');
  t.is(getHtmlLang('aa'), 'nb');
  t.end();
});
