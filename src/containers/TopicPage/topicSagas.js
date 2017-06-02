/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { all, take, call, put, select } from 'redux-saga/effects';
import { getTopic, hasFetchedTopicsBySubjectId } from './topicSelectors';
import * as actions from './topicActions';
import {
  getArticleIdFromResource,
  isArticleResource,
} from '../Resources/resourceHelpers';
import { fetchArticle } from '../ArticlePage/articleActions';
import * as articleApi from '../ArticlePage/articleApi';
import * as api from './topicApi';
import { getAccessToken } from '../App/sessionSelectors';

export function* fetchTopicIntroductions(topics) {
  try {
    const ids = topics.filter(isArticleResource).map(getArticleIdFromResource);

    if (ids.length === 0) {
      return;
    }
    const token = yield select(getAccessToken);
    const data = yield call(articleApi.fetchArticles, ids, token);
    yield put(
      actions.setTopicIntroductions({
        topics,
        articleIntroductions: data.results,
      }),
    );
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* fetchTopicArticle(subjectId, topicId) {
  const topic = yield select(getTopic(subjectId, topicId));
  const articleId = getArticleIdFromResource(topic);
  if (articleId) {
    yield put(fetchArticle(articleId));
  }
}

export function* fetchTopics(subjectId) {
  try {
    const token = yield select(getAccessToken);
    const topics = yield call(api.fetchTopics, subjectId, token);
    yield put(actions.setTopics({ topics, subjectId }));
    return topics;
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
    return [];
  }
}

export function* watchFetchTopics() {
  while (true) {
    const { payload: { subjectId, topicId } } = yield take(actions.fetchTopics);
    const hasFetched = yield select(hasFetchedTopicsBySubjectId(subjectId));
    if (!hasFetched) {
      const topics = yield call(fetchTopics, subjectId);
      yield all([
        call(fetchTopicArticle, subjectId, topicId),
        call(fetchTopicIntroductions, topics),
      ]);
    } else {
      yield call(fetchTopicArticle, subjectId, topicId);
    }
  }
}

export default [watchFetchTopics];
