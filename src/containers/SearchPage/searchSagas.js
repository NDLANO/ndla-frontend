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
// import * as resourceApi from '../Resources/resourceApi';
import { applicationError } from '../../modules/error';

export function* search(searchString, language) {
  try {
    console.log("skjera", searchString)
    const locale = yield select(getLocale);
    const searchResult = yield call(
      api.search,
      searchString,
      language || locale,
    );
    /* const newSearchResult = searchResult.results.map(async result => {
      if (result.contexts.length === 0 ) {
        return result;
      }
      const taxonomyResult = await resourceApi.fetchResourceTypesForResource(result.contexts[0].id, locale)
      return {
        ...result,
        resourceTypes: taxonomyResult,
      }
    }) */
    yield put(actions.setSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());
    yield put(applicationError(error));
  }
}

export function* groupSearch(searchString) {
  try {
    const locale = yield select(getLocale);
    const searchResult = yield call(api.groupSearch, searchString, locale);
    yield put(actions.setGroupSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());
    yield put(applicationError(error));
  }
}

export function* watchSearch() {
  while (true) {
    const { payload: { searchString, language } } = yield take(constants.SEARCH);
    yield call(search, searchString, language);
  }
}

export function* watchGroupSearch() {
  while (true) {
    const { payload: query } = yield take(constants.GROUP_SEARCH);
    yield call(groupSearch, query);
  }
}

export default [watchSearch, watchGroupSearch];
