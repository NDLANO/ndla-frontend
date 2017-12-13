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

test('resourceSagas watchFetchTopicsWithIntroductions', () => {
  const req1 = nock('http://ndla-api')
    .get(
      '/taxonomy/v1/subjects/urn:subject:1/topics/?recursive=true&language=en',
    )
    .reply(200, topics);

  const req2 = nock('http://ndla-api')
    .get('/article-api/v2/articles?ids=1,1_2')
    .reply(200, { results: articles });

  return expectSaga(sagas.watchFetchTopicsWithIntroductions)
    .withState({ topics: initialState, locale: 'en' })
    .dispatch(
      actions.fetchTopicsWithIntroductions({
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

test('topicSagas watchFetchTopicsWithIntroductions when topics are in state', () => {
  const req1 = nock('http://ndla-api')
    .get('/article-api/v2/articles?ids=1,1_2')
    .reply(200, { results: articles });

  return expectSaga(sagas.watchFetchTopicsWithIntroductions)
    .withState({ topics: { all: { 'urn:subject:1': topics } }, locale: 'en' })
    .dispatch(
      actions.fetchTopicsWithIntroductions({
        subjectId: 'urn:subject:1',
        topicId: 'urn:topic:1',
      }),
    )
    .silentRun(500)
    .then(result => {
      expect(result.toJSON()).toMatchSnapshot();
      req1.done();
    });
});

test('topicSagas watchFetchTopics', () => {
  const req1 = nock('http://ndla-api')
    .get(
      '/taxonomy/v1/subjects/urn:subject:1/topics/?recursive=true&language=en',
    )
    .reply(200, topics);

  return expectSaga(sagas.watchFetchTopics)
    .withState({ topics: initialState, locale: 'en' })
    .dispatch(
      actions.fetchTopics({
        subjectId: 'urn:subject:1',
      }),
    )
    .silentRun(500)
    .then(result => {
      expect(result.toJSON()).toMatchSnapshot();
      req1.done();
    });
});

test('topicSagas watchFetchTopics when topics already are in state', () =>
  expectSaga(sagas.watchFetchTopics)
    .withState({ topics: { all: { 'urn:subject:1': topics } } })
    .dispatch(
      actions.fetchTopics({
        subjectId: 'urn:subject:1',
      }),
    )
    .silentRun(500)
    .then(result => {
      expect(result.toJSON()).toMatchSnapshot();
    }));

test('topicSagas fetchTopicIntroductions do not call fetchArticles if no valid ids', () => {
  const mockTopics = [{ contentUri: 'urn:learningpath:2' }];
  const saga = testSaga(sagas.fetchTopicIntroductions, mockTopics);
  saga.next().isDone();
});

test('resourceSagas watchFetchTopicArticle', () => {
  const req1 = nock('http://ndla-api')
    .get('/taxonomy/v1/topics/urn:topic:1/?language=en')
    .reply(200, topics[0]);

  const req2 = nock('http://ndla-api')
    .get('/article-converter/json/en/1')
    .reply(200, {});

  return expectSaga(sagas.watchFetchTopicArticle)
    .withState({ topics: initialState, articles: { all: {} }, locale: 'en' })
    .dispatch(
      actions.fetchTopicArticle({
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
