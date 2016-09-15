/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';

import { getResults, getLastPage } from '../searchSelectors';
import search from './_mockSearchResult';


test('searchSelectors getResults', (t) => {
  const state = {
    search,
  };

  t.is(getResults(state), search.results);
});

test('searchSelectors getLastPage', (t) => {
  const lastPageTestState = (totalCount, pageSize) => ({
    search: {
      totalCount,
      pageSize,
    },
  });

  t.is(getLastPage(lastPageTestState(1, 1)), 1);
  t.is(getLastPage(lastPageTestState(1, 10)), 1);
  t.is(getLastPage(lastPageTestState(27, 10)), 3);
  t.is(getLastPage(lastPageTestState(234, 10)), 24);
  t.is(getLastPage(lastPageTestState(234, 100)), 3);
});
