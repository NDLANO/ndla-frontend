/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';

import { getArticle } from '../articleSelectors';

test('articleSelectors getArticle', (t) => {
  const state = {
    article: {
      id: 1,
      title: 'Test',
    },
  };

  t.is(getArticle(state).id, 1);
  t.is(getArticle(state).title, 'Test');
});
