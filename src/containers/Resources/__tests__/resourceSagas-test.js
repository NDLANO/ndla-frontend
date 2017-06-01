/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { testSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import * as sagas from '../resourceSagas';
import * as actions from '../resourceActions';
import * as api from '../resourceApi';
import { getAccessToken } from '../../App/sessionSelectors';
import { resources } from './mockResources';

test('resourceSagas watchFetchTopicResources', () => {
  const saga = testSaga(sagas.watchFetchTopicResources);
  saga
    .next()
    .take(actions.fetchTopicResources)
    .next({ payload: { topicId: 2 } })
    .next([])
    .all([call(sagas.fetchTopicResources, 2), call(sagas.fetchResourceTypes)])
    .finish()
    .next()
    .isDone();
});

test('topicSagas fetchResourceTypes', () => {
  const token = '12345678';
  const topicId = 'urn:topic:1234';
  const saga = testSaga(sagas.fetchResourceTypes, topicId);
  saga
    .next()
    .select(getAccessToken)
    .next(token)
    .call(api.fetchResourceTypes, token)
    .next([])
    .put({ type: actions.setResourceTypes.toString(), payload: [] })
    .next()
    .isDone();
});

test('topicSagas fetchTopicResources', () => {
  const token = '12345678';
  const topicId = 'urn:topic:1234';
  const saga = testSaga(sagas.fetchTopicResources, topicId);
  saga
    .next()
    .select(getAccessToken)
    .next(token)
    // .all([
    //   call(api.fetchResourceTypes, token),
    // ])
    .call(api.fetchTopicResources, topicId, token)
    .next(resources)
    .put({
      type: actions.setTopicResources.toString(),
      payload: { topicId, resources },
    })
    .next()
    // .put({ type: actions.setResourceTypes.toString(), payload: [] })
    // .next()

    .all([
      call(sagas.fetchArticleResourcesData, topicId, resources.slice(2), token),
      call(
        sagas.fetchLearningPathResourcesData,
        topicId,
        resources.slice(0, 2),
        token,
      ),
    ])
    .next()
    .isDone();
});
