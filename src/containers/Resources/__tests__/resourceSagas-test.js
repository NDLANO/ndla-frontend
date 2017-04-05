/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import testSaga from 'redux-saga-test-plan';
import * as sagas from '../resourceSagas';
import * as actions from '../resourceActions';


test('resourceSagas watchFetchTopicResources', () => {
  const saga = testSaga(sagas.watchFetchTopicResources);
  saga
    .next()
    .take(actions.fetchTopicResources)
    .next({ payload: { topicId: 2 } })
    .next([])
    .call(sagas.fetchTopicResources, 2)

    .finish()
    .next()
    .isDone();
});
