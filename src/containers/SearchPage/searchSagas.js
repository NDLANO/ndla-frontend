/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put } from 'redux-saga/effects';

import * as constants from './searchConstants';
import * as actions from './searchActions';
import * as api from './searchApi';
import { applicationError } from '../../modules/error';

export function* search(searchString) {
  try {
    const searchResult = yield call(api.search, searchString);
    yield put(actions.setSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());
    yield put(applicationError(error));
  }
}

export function* groupSearch(searchString) {
  try {
    const searchResult = yield call(api.groupSearch, searchString);
    yield put(actions.setGroupSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());
    yield put(applicationError(error));
  }
}

export function* watchSearch() {
  while (true) {
    const {
      payload: { searchString },
    } = yield take(constants.SEARCH);
    yield call(search, searchString);
  }
}

export function* watchGroupSearch() {
  while (true) {
    const { payload: query } = yield take(constants.GROUP_SEARCH);
    yield call(groupSearch, query);
  }
}

export default [watchSearch, watchGroupSearch];
