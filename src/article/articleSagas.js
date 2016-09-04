/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import { getLocale } from '../locale/localeSelectors';
import { getArticle } from './articleSelectors';
import * as constants from './articleConstants';
import * as actions from './articleActions';
import * as api from './articleApi';

function* fetchArticle(id) {
  try {
    const locale = yield select(getLocale);
    const article = yield call(api.fetchArticle, id, locale);
    const articleWithId = Object.assign({}, article, { id });
    yield put(actions.setArticle(articleWithId));
  } catch (error) {
    // TODO: handle error
    // yield put(actions.applicationError());
  }
}

function* watchFetchArticle() {
  while (true) {
    const { payload: id } = yield take(constants.FETCH_ARTICLE);
    const currentArticle = yield select(getArticle);
    if (currentArticle.id !== id) {
      yield call(fetchArticle, id);
    }
  }
}

export default [
  watchFetchArticle,
];
