/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga-effects';
import * as actions from './resourceActions';
import * as articleApi from '../ArticlePage/articleApi';
import * as learningPathApi from './learningPathApi';
import * as api from './resourceApi';
import { isLearningPathResource, isArticleResource, getArticleIdFromResource, getLearningPathIdFromResource } from './resourceHelpers';
import { getAccessToken } from '../App/sessionSelectors';
import { getResourcesByTopicId } from './resourceSelectors';

export function* fetchLearningPathResourcesData(topicId, resources, token) {
  try {
    const ids = resources.map(getLearningPathIdFromResource);
    if (ids.length > 0) {
      const data = yield call(learningPathApi.fetchLearningPaths, ids, token);
      yield put(actions.setLearningPathResourceData({ topicId, learningPathResourceData: data.results }));
    }
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* fetchArticleResourcesData(topicId, resources, token) {
  try {
    const ids = resources.map(getArticleIdFromResource);
    if (ids.length > 0) {
      const data = yield call(articleApi.fetchArticles, ids, token);
      yield put(actions.setArticleResourceData({ topicId, articleResourceData: data.results }));
    }
  } catch (error) {
    console.error(error); //eslint-disable-line
  }
}

export function* fetchResourceTypes() {
  try {
    const token = yield select(getAccessToken);
    const resourceTypes = yield call(api.fetchResourceTypes, token);
    yield put(actions.setResourceTypes(resourceTypes));
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* fetchTopicResources(topicId) {
  try {
    const token = yield select(getAccessToken);
    const resources = yield call(api.fetchTopicResources, topicId, token);
    yield put(actions.setTopicResources({ topicId, resources }));
    yield [
      call(fetchArticleResourcesData, topicId, resources.filter(isArticleResource), token),
      call(fetchLearningPathResourcesData, topicId, resources.filter(isLearningPathResource), token),
    ];
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchTopicResources() {
  while (true) {
    const { payload: { topicId } } = yield take(actions.fetchTopicResources);
    const resources = yield select(getResourcesByTopicId(topicId));
    if (resources.length === 0) {
      yield [
        call(fetchTopicResources, topicId),
        call(fetchResourceTypes),
      ];
    }
  }
}

export default [
  watchFetchTopicResources,
];
