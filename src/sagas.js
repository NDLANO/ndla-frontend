/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { fork } from 'redux-saga/effects';
import articleSagas from './article/articleSagas';

export default function* root() {
  yield [
    ...articleSagas.map(s => fork(s)),
  ];
}
