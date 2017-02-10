/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import { getLocale } from '../Locale/localeSelectors';
import { getConvertedArticle } from './articleSelectors';
import * as constants from './articleConstants';
import * as actions from './articleActions';
import * as api from './articleApi';

export function* fetchConvertedArticle(id) {
  try {
    const locale = yield select(getLocale);
    const article = yield call(api.fetchConvertedArticle, id, locale);
    yield put(actions.setConvertedArticle(article));
  } catch (error) {
    throw error;
    // TODO: handle error
    // yield put(actions.applicationError());
  }
}

export function* watchFetchConvertedArticle() {
  while (true) {
    const { payload: id } = yield take(constants.FETCH_CONVERTED_ARTICLE);
    const currentArticle = yield select(getConvertedArticle(id));
    if (!currentArticle || currentArticle.id !== id) {
      yield call(fetchConvertedArticle, id);
    }
  }
}

export function* fetchArticles(ids) {
  try {
    const articles = yield call(api.fetchConvertedArticle, ids);
    yield put(actions.setArticles(articles));
  } catch (error) {
    throw error;
    // TODO: handle error
    // yield put(actions.applicationError());
  }
}

export function* watchFetchArticles() {
  while (true) {
    const { payload: ids } = yield take(constants.FETCH_ARTICLES);

    console.log(ids);
    // const currentArticle = yield select(getConvertedArticle(id));
    // if (!currentArticle || currentArticle.id !== id) {
    //   yield call(fetchConvertedArticle, id);
    // }
  }
}

export default [
  watchFetchArticles,
  watchFetchConvertedArticle,
];
