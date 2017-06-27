/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, all, put, select } from 'redux-saga/effects';
import { getLocale } from '../Locale/localeSelectors';
import { getArticle } from './articleSelectors';
import * as constants from './articleConstants';
import * as actions from './articleActions';
import * as api from './articleApi';
import * as resourceApi from '../Resources/resourceApi';

export function* fetchResourceTypesForArticle(resourceId, locale) {
  try {
    const resource = yield call(
      resourceApi.fetchResourceTypesForResource,
      resourceId,
      locale,
    );
    return resource;
  } catch (error) {
    console.error(error); //eslint-disable-line
    return [];
  }
}

export function* fetchArticle(articleId, resourceId) {
  try {
    const locale = yield select(getLocale);
    if (resourceId) {
      const [article, resourceTypes] = yield all([
        call(api.fetchArticle, articleId, locale),
        call(fetchResourceTypesForArticle, resourceId, locale),
      ]);
      yield put(actions.setArticle({ ...article, resourceTypes }));
    } else {
      const article = yield call(api.fetchArticle, articleId, locale);
      yield put(actions.setArticle(article));
    }
  } catch (error) {
    // TODO: better error handling
    if (error.json && error.json.status === 404) {
      // tmp hack
      yield put(
        actions.setArticle({
          id: articleId,
          status: 404,
          content: '',
        }),
      );
    }
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchArticle() {
  while (true) {
    const { payload: { articleId, resourceId } } = yield take(
      constants.FETCH_ARTICLE,
    );
    const currentArticle = yield select(getArticle(articleId));
    if (!currentArticle || currentArticle.id !== articleId) {
      yield call(fetchArticle, articleId, resourceId);
    }
  }
}

export default [watchFetchArticle];
