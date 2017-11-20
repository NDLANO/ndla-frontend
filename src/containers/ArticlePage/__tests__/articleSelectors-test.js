/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getArticle } from '../article';

const state = {
  locale: 'nb',
  articles: {
    all: {
      1: {
        id: 1,
        created: '2014-12-24T10:44:06Z',
        language: 'nb',
        title: 'Tester',
        metaDescription: 'Beskrivelse',
        metaData: {},
      },
      2: {
        id: 2,
        created: '2014-11-24T10:44:06Z',
        language: 'en',
        title: 'Testing',
        metaDescription: 'Description',
        metaData: {},
      },
    },
  },
};

test('articleSelectors getArticle with id', () => {
  expect(getArticle(1)(state).id).toBe(1);
  expect(getArticle(2)(state).id).toBe(2);
});

test('articleSelectors getArticle nb locale', () => {
  const getArticleSelector = getArticle(1);
  expect(getArticleSelector(state).id).toBe(1);
  expect(getArticleSelector(state).title).toBe('Tester');
  expect(getArticleSelector(state).language).toBe('nb');
  expect(getArticleSelector(state).created).toBe('24.12.2014');
  expect(getArticleSelector(state).metaDescription).toBe('Beskrivelse');
});

test('articleSelectors getArticle en locale', () => {
  const getArticleSelector = getArticle(2);
  const stateWithEnLocale = { ...state, locale: 'en' };
  expect(getArticleSelector(stateWithEnLocale).id).toBe(2);
  expect(getArticleSelector(stateWithEnLocale).title).toBe('Testing');
  expect(getArticleSelector(state).language).toBe('en');
  expect(getArticleSelector(stateWithEnLocale).created).toBe('11/24/2014');
  expect(getArticleSelector(stateWithEnLocale).metaDescription).toBe(
    'Description',
  );
});

test('articleSelectors getArticle returns undefined if article is not in state', () => {
  const getArticleSelector = getArticle(3);
  expect(getArticleSelector(state)).toEqual(undefined);
});
