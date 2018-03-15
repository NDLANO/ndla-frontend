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
import { getResource } from '../Resources/resource';
import { getArticleIdFromResource } from '../Resources/resourceHelpers';
import { applicationError } from '../../modules/error';

function* fetchResourceTypesForArticle(resourceId, locale) {
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

function* fetchResource(resourceId) {
  let resource = yield select(getResource(resourceId));
  if (!resource) {
    const locale = yield select(getLocale);
    resource = yield call(resourceApi.fetchResource, resourceId, locale);
  }
  return resource;
}

function* fetchArticle(resourceId) {
  try {
    const resource = yield call(fetchResource, resourceId);
    const articleId = getArticleIdFromResource(resource);
    const locale = yield select(getLocale);
    const [article, resourceTypes] = yield all([
      call(api.fetchArticle, articleId, locale),
      call(fetchResourceTypesForArticle, resourceId, locale),
    ]);
    yield put(
      actions.setArticle({ ...article, urn: resourceId, resourceTypes }),
    );
    yield put(actions.fetchArticleSuccess());
  } catch (error) {
    yield put(applicationError(error));
    yield put(actions.fetchArticleError({ error }));
  }
}

export function* watchFetchArticle() {
  while (true) {
    const { payload: { resourceId } } = yield take(actions.fetchArticle);
    const currentArticle = yield select(getArticle(resourceId));
    if (!currentArticle || currentArticle.urn !== resourceId) {
      yield call(fetchArticle, resourceId);
    }
  }
}

export default [watchFetchArticle];
