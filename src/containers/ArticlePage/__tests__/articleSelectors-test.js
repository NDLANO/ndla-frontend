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
      'urn:resource:1': {
        id: 1,
        urn: 'urn:resource:12',
        created: '2014-12-24T10:44:06Z',
        language: 'nb',
        title: 'Test resource 2',
        metaDescription: 'Beskrivelse',
        metaData: {},
      },
      'urn:topic:1': {
        id: 2,
        urn: 'urn:topic:123',
        created: '2014-11-24T10:44:06Z',
        language: 'en',
        title: 'Testing',
        metaDescription: 'Description',
        metaData: {},
      },
      'urn:resource:2': {
        id: 3,
        urn: 'urn:resource:2',
        created: '2014-12-24T10:44:06Z',
        updated: '2017-11-24T10:44:06Z',
        language: 'nb',
        title: 'Test resource 2',
        metaDescription: 'Beskrivelse',
        metaData: {},
      },
    },
  },
};

test('articleSelectors getArticle by urn', () => {
  expect(getArticle('urn:resource:1')(state)).toMatchSnapshot();
  expect(getArticle('urn:topic:123')(state)).toMatchSnapshot();
});

test('articleSelectors getArticle en locale', () => {
  const getArticleSelector = getArticle('urn:resource:2');
  const stateWithEnLocale = { ...state, locale: 'en' };
  expect(getArticleSelector(stateWithEnLocale)).toMatchSnapshot();
});

test('articleSelectors getArticle returns undefined if article is not in state', () => {
  const getArticleSelector = getArticle('urn:resource:1337');
  expect(getArticleSelector(state)).toEqual(undefined);
});
