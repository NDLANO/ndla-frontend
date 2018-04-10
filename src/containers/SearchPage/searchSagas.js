/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';

import { getLocale } from '../Locale/localeSelectors';
import * as constants from './searchConstants';
import * as actions from './searchActions';
import * as api from './searchApi';
import { applicationError } from '../../modules/error';

export function* search(queryString, language) {
  try {
    const locale = yield select(getLocale);
    const searchResult = yield call(
      api.search,
      queryString,
      language || locale,
    );
    yield put(actions.setSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());
    yield put(applicationError(error));
  }
}

export function* groupSearch(queryString) {
  try {
    const locale = yield select(getLocale);
    const searchResult = yield call(api.groupSearch, queryString, locale);
    yield put(actions.setGroupSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());
    yield put(applicationError(error));
  }
}

export function* watchSearch() {
  while (true) {
    const { payload: { query, language } } = yield take(constants.SEARCH);
    yield call(search, query, language);
  }
}

export function* watchGroupSearch() {
  while (true) {
    const { payload: query } = yield take(constants.GROUP_SEARCH);
    yield call(groupSearch, query);
  }
}

export default [watchSearch, watchGroupSearch];
