/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getArticle } from '../articleSelectors';

const state = {
  locale: 'nb',
  articles: {
    1: {
      id: 1,
      created: '2014-12-24T10:44:06Z',
      title: [
        { title: 'Tester', language: 'nb' },
        { title: 'Testing', language: 'en' },
      ],
      metaDescription: [
        { metaDescription: 'Beskrivelse', language: 'nb' },
        { metaDescription: 'Description', language: 'en' },
      ],
    },
    2: {
      id: 2,
      created: '2014-11-24T10:44:06Z',
      title: [
        { title: 'Tester', language: 'nb' },
        { title: 'Testing', language: 'en' },
      ],
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
  expect(getArticleSelector(state).created).toBe('24.12.2014');
  expect(getArticleSelector(state).metaDescription).toBe('Beskrivelse');
});

test('articleSelectors getArticle en locale', () => {
  const getArticleSelector = getArticle(1);
  const stateWithEnLocale = { ...state, locale: 'en' };
  expect(getArticleSelector(stateWithEnLocale).id).toBe(1);
  expect(getArticleSelector(stateWithEnLocale).title).toBe('Testing');
  expect(getArticleSelector(stateWithEnLocale).created).toBe('12/24/2014');
  expect(getArticleSelector(stateWithEnLocale).metaDescription).toBe(
    'Description',
  );
});

test('articleSelectors getArticle returns undefined if article is not in state', () => {
  const getArticleSelector = getArticle(3);
  expect(getArticleSelector(state)).toEqual(undefined);
});
