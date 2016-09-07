/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { getLocale } from '../locale/localeSelectors';
import { toSearch } from '../main/routes';

import * as constants from './searchConstants';
import * as actions from './searchActions';
import * as api from './searchApi';

export function* search(query, page) {
  try {
    const locale = yield select(getLocale);
    const searchResult = yield call(api.search, query, page, locale);
    yield put(push({ pathname: toSearch(), query: { query, page } }));
    yield put(actions.setSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());

    // TODO: handle error
    // yield put(actions.applicationError());
  }
}

export function* watchSearch() {
  while (true) {
    const { payload: { query, page } } = yield take(constants.SEARCH);
    yield call(search, query, page);
  }
}

export default [
  watchSearch,
];
