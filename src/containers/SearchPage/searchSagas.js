/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga-effects';
import { push } from 'react-router-redux';

import { getLocale } from '../Locale/localeSelectors';
import { toSearch } from '../../routes';
import { getAccessToken } from '../App/sessionSelectors';
import * as constants from './searchConstants';
import * as actions from './searchActions';
import * as api from './searchApi';

export function* search(query, page, sortOrder) {
  try {
    const locale = yield select(getLocale);
    const token = yield select(getAccessToken);
    const searchResult = yield call(api.search, query, page, locale, sortOrder, token);
    yield put(push({ pathname: toSearch(), query: { query, page, sortOrder } }));
    yield put(actions.setSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchSearch() {
  while (true) {
    const { payload: { query, page, sortOrder } } = yield take(constants.SEARCH);
    yield call(search, query, page, sortOrder);
  }
}

export default [
  watchSearch,
];
