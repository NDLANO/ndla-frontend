/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, all, put, select } from 'redux-saga/effects';
import { getLocale } from '../Locale/localeSelectors';
import { actions, getArticle } from './article';
import * as api from './articleApi';
import * as resourceApi from '../Resources/resourceApi';
import { applicationError } from '../../modules/error';

export function* fetchResourceTypesForArticle(resourceId, locale) {
  try {
    const resource = yield call(
      resourceApi.fetchResourceTypesForResource,
      resourceId,
      locale,
    );
    return resource;
  } catch (error) {
    yield put(applicationError(error));
    return [];
  }
}

export function* fetchArticle(articleId, resourceId, history) {
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
    yield put(actions.fetchArticleSuccess());
  } catch (error) {
    if (error.json && error.json.status === 404 && history) {
      history.replace('/not-found');
    }
    yield put(applicationError(error));
    yield put(actions.fetchArticleError());
  }
}

export function* watchFetchArticle() {
  while (true) {
    const { payload: { articleId, resourceId, history } } = yield take(
      actions.fetchArticle,
    );
    const currentArticle = yield select(getArticle(articleId));
    if (!currentArticle || currentArticle.id.toString() !== articleId) {
      yield call(fetchArticle, articleId, resourceId, history);
    }
  }
}

export default [watchFetchArticle];
