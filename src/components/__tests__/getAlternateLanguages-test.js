/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getAlternateLanguages } from '../SocialMediaMetadata';

test('getAlternateLanguages with article and basename is empty', () => {
  const alternateLanguages = getAlternateLanguages('', 'nb', {
    supportedLanguages: ['nb', 'nn', 'en'],
  });
  expect(alternateLanguages).toMatchSnapshot();
});

test('getAlternateLanguages with article and basename is en', () => {
  const alternateLanguages = getAlternateLanguages('en', 'en', {
    supportedLanguages: ['nb', 'nn', 'en'],
  });
  expect(alternateLanguages).toMatchSnapshot();
});

test('getAlternateLanguages without article and basename is empty', () => {
  const alternateLanguages = getAlternateLanguages('', 'nb');
  expect(alternateLanguages).toMatchSnapshot();
});

test('getAlternateLanguages without article and basename is nn', () => {
  const alternateLanguages = getAlternateLanguages('nn', 'nn');
  expect(alternateLanguages).toMatchSnapshot();
});
