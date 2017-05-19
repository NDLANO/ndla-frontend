/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';

import { getLocale } from '../Locale/localeSelectors';
import { getAccessToken } from '../App/sessionSelectors';
import * as constants from './searchConstants';
import * as actions from './searchActions';
import * as api from './searchApi';

export function* search(queryString) {
  try {
    const locale = yield select(getLocale);
    const token = yield select(getAccessToken);
    const searchResult = yield call(api.search, queryString, locale, token);
    yield put(actions.setSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchSearch() {
  while (true) {
    const { payload: queryString } = yield take(constants.SEARCH);
    yield call(search, queryString);
  }
}

export default [
  watchSearch,
];
