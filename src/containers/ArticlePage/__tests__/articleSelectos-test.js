/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';

import { getArticle } from '../articleSelectors';

const state = {
  locale: 'nb',
  article: {
    id: 1,
    titles: [
        { title: 'Tester', language: 'nb' },
        { title: 'Testing', language: 'en' },
    ],
  },
};

test('articleSelectors getArticle nb locale', (t) => {
  t.is(getArticle(state).id, 1);
  t.is(getArticle(state).title, 'Tester');
});

test('articleSelectors getArticle en locale', (t) => {
  const stateWithEnLocale = { ...state, locale: 'en' };
  t.is(getArticle(stateWithEnLocale).id, 1);
  t.is(getArticle(stateWithEnLocale).title, 'Testing');
});
