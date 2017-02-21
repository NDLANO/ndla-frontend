/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { call, put } from 'redux-saga/effects';
import * as actions from './resourceActions';
// import * as articleApi from '../ArticlePage/articleApi';
import * as api from './resourceApi';

export function* fetchTopicResources(topicId) {
  try {
    const resources = yield call(api.fetchTopicResources, topicId);
    // const data = yield call(articleApi.fetchArticles, ids);
    yield put(actions.setTopicResources({ topicId, resources }));
  } catch (error) {
    throw error;
  }
}


export default [
];
