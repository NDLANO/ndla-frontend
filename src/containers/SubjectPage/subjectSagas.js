/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import { hasFetched, getTopic } from './subjectSelectors';
import * as constants from './subjectConstants';
import * as actions from './subjectActions';
import { fetchConvertedArticle } from '../ArticlePage/articleActions';
import * as api from './subjectApi';

export function* fetchSubjects() {
  try {
    const subjects = yield call(api.fetchSubjects);
    yield put(actions.setSubjects(subjects));
  } catch (error) {
    throw error;
    // TODO: handle error
    // yield put(actions.applicationError());
  }
}

export function* watchFetchSubjects() {
  while (true) {
    yield take(constants.FETCH_SUBJECTS);
    const fetched = yield select(hasFetched);
    if (!fetched) {
      yield call(fetchSubjects);
    }
  }
}

export function* fetchTopics(subjectId, topicId) {
  try {
    const topics = yield call(api.fetchTopics, subjectId);
    yield put(actions.setTopics({ topics, subjectId }));
    if (topicId) { // Fetch related article if topicId is defined
      yield put(actions.fetchTopicArticle({ topicId, subjectId }));
    }
  } catch (error) {
    throw error;
    // TODO: handle error
    // yield put(actions.applicationError());
  }
}

export function* watchFetchTopics() {
  while (true) {
    const { payload } = yield take(constants.FETCH_TOPICS);
    // TODO: Check if already fetched
    if (!payload.topicId) {
      yield call(fetchTopics, payload);
    } else {
      yield call(fetchTopics, payload.subjectId, payload.topicId);
    }
  }
}


export function* watchFetchTopicArticle() {
  while (true) {
    const { payload: { subjectId, topicId } } = yield take(constants.FETCH_TOPIC_ARTICLE);
    const topic = yield select(getTopic(subjectId, topicId));

    if (!topic) {
      yield put(actions.fetchTopics({ subjectId, topicId })); // Need to fetch topics first
    } else if (topic.contentUri) {
      yield put(fetchConvertedArticle(topic.contentUri.replace('urn:article:', '')));
    }
  }
}

export default [
  watchFetchSubjects,
  watchFetchTopics,
  watchFetchTopicArticle,
];
