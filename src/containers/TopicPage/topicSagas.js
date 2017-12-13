/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import {
  actions,
  getTopic,
  hasFetchedTopicsBySubjectId,
  getAllTopicsBySubjectId,
} from './topic';
import { getLocale } from '../Locale/localeSelectors';
import {
  getArticleIdFromResource,
  isArticleResource,
} from '../Resources/resourceHelpers';
import { actions as articleActions, getArticle } from '../ArticlePage/article';
import { applicationError } from '../../modules/error';
import * as articleApi from '../ArticlePage/articleApi';
import * as api from './topicApi';

export function* fetchTopicIntroductions(topics) {
  try {
    const ids = topics.filter(isArticleResource).map(getArticleIdFromResource);

    if (ids.length === 0) {
      return;
    }
    const data = yield call(articleApi.fetchArticles, ids);
    yield put(
      actions.setTopicIntroductions({
        topics,
        articleIntroductions: data.results,
      }),
    );
  } catch (error) {
    yield put(applicationError(error));
  }
}

export function* fetchTopicArticle(subjectId, topicId) {
  try {
    const locale = yield select(getLocale);
    let topic = yield select(getTopic(subjectId, topicId));
    if (!topic) {
      topic = yield call(api.fetchTopic, topicId, locale);
    }
    const articleId = getArticleIdFromResource(topic);
    let article = yield select(getArticle(articleId));
    if (articleId && !article) {
      article = yield call(articleApi.fetchArticle, articleId, locale);
      yield put(articleActions.setArticle(article));
    }
    yield put(actions.fetchTopicArticleSuccess());
  } catch (error) {
    yield put(applicationError(error));
    yield put(actions.fetchTopicArticleError());
  }
}

export function* fetchTopics(subjectId) {
  try {
    const locale = yield select(getLocale);
    const topics = yield call(api.fetchTopics, subjectId, locale);
    yield put(actions.setTopics({ topics, subjectId }));
    return topics;
  } catch (error) {
    yield put(applicationError(error));
    yield put(actions.fetchTopicsError());
    return [];
  }
}

export function* fetchTopicsWithIntroductions(subjectId) {
  const hasFetched = yield select(hasFetchedTopicsBySubjectId(subjectId));
  if (!hasFetched) {
    const topics = yield call(fetchTopics, subjectId);
    yield call(fetchTopicIntroductions, topics);
  } else {
    const topics = yield select(getAllTopicsBySubjectId(subjectId));
    yield call(fetchTopicIntroductions, topics);
  }
}

export function* watchFetchTopicsWithIntroductions() {
  while (true) {
    const { payload: { subjectId } } = yield take(
      actions.fetchTopicsWithIntroductions,
    );
    yield call(fetchTopicsWithIntroductions, subjectId);
  }
}

export function* watchFetchTopics() {
  while (true) {
    const { payload: { subjectId } } = yield take(actions.fetchTopics);
    const hasFetched = yield select(hasFetchedTopicsBySubjectId(subjectId));
    if (!hasFetched) {
      yield call(fetchTopics, subjectId);
    }
  }
}

export function* watchFetchTopicArticle() {
  while (true) {
    const { payload: { subjectId, topicId } } = yield take(
      actions.fetchTopicArticle,
    );
    yield call(fetchTopicArticle, subjectId, topicId);
  }
}

export default [
  watchFetchTopics,
  watchFetchTopicsWithIntroductions,
  watchFetchTopicArticle,
];
