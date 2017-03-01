/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { call, put } from 'redux-saga-effects';
import * as actions from './resourceActions';
import * as articleApi from '../ArticlePage/articleApi';
import * as learningPathApi from './learningPathApi';
import * as api from './resourceApi';
import { isLearningPathResource, isArticleResource, getArticleIdFromResource, getLearningPathIdFromResource } from './resourceHelpers';

export function* fetchLearningPathResourcesData(topicId, resources) {
  try {
    const ids = resources.map(getLearningPathIdFromResource);
    if (ids.length > 0) {
      const data = yield call(learningPathApi.fetchLearningPaths, ids);
      yield put(actions.setLearningPathResourceData({ topicId, learningPathResourceData: data.results }));
    }
  } catch (error) {
    throw error;
  }
}

export function* fetchArticleResourcesData(topicId, resources) {
  try {
    const ids = resources.map(getArticleIdFromResource);
    if (ids.length > 0) {
      const data = yield call(articleApi.fetchArticles, ids);
      yield put(actions.setArticleResourceData({ topicId, articleResourceData: data.results }));
    }
  } catch (error) {
    throw error;
  }
}

export function* fetchTopicResources(topicId) {
  try {
    const resources = yield call(api.fetchTopicResources, topicId);
    yield put(actions.setTopicResources({ topicId, resources }));
    yield [
      call(fetchArticleResourcesData, topicId, resources.filter(isArticleResource)),
      call(fetchLearningPathResourcesData, topicId, resources.filter(isLearningPathResource)),
    ];
  } catch (error) {
    throw error;
  }
}


export default [
];
