/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  getAlternateLanguages,
  getAlternateUrl,
  getCanonicalUrl,
} from '../SocialMediaMetadata';

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

test('getAlternateUrl with article-url and empty language', () => {
  const alternateUrl = getAlternateUrl({ pathname: '/article/123' }, 'nb');
  expect(alternateUrl).toMatch('https://test.ndla.no/nb/article/123');
});

test('getAlternateUrl with iframe-url and nn language', () => {
  const alternateUrl = getAlternateUrl(
    { pathname: '/article-iframe/nb/urn:topic:123/1' },
    'nn',
  );
  expect(alternateUrl).toMatch(
    'https://test.ndla.no/article-iframe/nn/urn:topic:123/1',
  );
});

test('getCanonicalUrl with article-url and empty language', () => {
  const canonicalUrl = getCanonicalUrl({ pathname: '/article/123' });
  expect(canonicalUrl).toMatch('https://test.ndla.no/article/123');
});

test('getCanonicalUrl with iframe-url and nb language', () => {
  const canonicalUrl = getCanonicalUrl({
    pathname: '/article-iframe/nb/urn:topic:123/1',
  });
  expect(canonicalUrl).toMatch(
    'https://test.ndla.no/article-iframe/urn:topic:123/1',
  );
});

test('getCanonicalUrl with iframe-url and no language', () => {
  const canonicalUrl = getCanonicalUrl({
    pathname: '/article-iframe/urn:topic:123/1',
  });
  expect(canonicalUrl).toMatch(
    'https://test.ndla.no/article-iframe/urn:topic:123/1',
  );
});
