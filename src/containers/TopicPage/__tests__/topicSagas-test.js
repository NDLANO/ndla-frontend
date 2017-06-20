/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { testSaga, expectSaga } from 'redux-saga-test-plan';
import nock from 'nock';
import * as sagas from '../topicSagas';
import { initialState, actions } from '../topic';
import { topics, articles } from './mockTopics';

test('resourceSagas watchFetchTopics', () => {
  const req1 = nock('http://ndla-api')
    .get(
      '/taxonomy/v1/subjects/urn:subject:1/topics/?recursive=true&language=en',
    )
    .reply(200, topics);

  const req2 = nock('http://ndla-api')
    .get('/article-api/v1/articles?ids=1,1_2')
    .reply(200, { results: articles });

  return expectSaga(sagas.watchFetchTopics)
    .withState({ topics: initialState, locale: 'en' })
    .dispatch(
      actions.fetchTopics({
        subjectId: 'urn:subject:1',
        topicId: 'urn:topic:1',
      }),
    )
    .silentRun(500)
    .then(result => {
      expect(result.toJSON()).toMatchSnapshot();
      req1.done();
      req2.done();
    });
});

test('topicSagas watchFetchTopics should not refetch topics', () => {
  const saga = testSaga(sagas.watchFetchTopics);
  saga
    .next()
    .take(actions.fetchTopics)
    .next({ payload: { subjectId: 1234 } })
    .next(true)
    .call(sagas.fetchTopicArticle, 1234, undefined)
    .finish()
    .isDone();
});

test('topicSagas fetchTopicIntroductions do not call fetchArticles if no valid ids', () => {
  const mockTopics = [{ contentUri: 'urn:learningpath:2' }];
  const saga = testSaga(sagas.fetchTopicIntroductions, mockTopics);
  saga.next().isDone();
});
