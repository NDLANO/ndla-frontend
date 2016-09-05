/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';

import { getResults } from '../searchSelectors';
import search from './_mockSearchResult';

test('searchSelectors getResults', (t) => {
  const state = {
    search,
  };

  t.is(getResults(state), search.results);
});
