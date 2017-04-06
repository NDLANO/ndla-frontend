/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import testSaga from 'redux-saga-test-plan';
import { call } from 'redux-saga-effects';
import * as sagas from '../topicSagas';
import * as api from '../topicApi';
import * as articleApi from '../../ArticlePage/articleApi';
import { fetchArticle } from '../../ArticlePage/articleActions';
import * as actions from '../topicActions';
import { getAccessToken } from '../../App/sessionSelectors';
import { topics } from './mockTopics';

// import { hasFetchedTopicsBySubjectId, getTopic } from '../topicSelectors';

test('topicSagas fetchTopicArticle if articleId is defined', () => {
  const saga = testSaga(sagas.fetchTopicArticle, 1234);
  saga
    .next()
    // .select(getTopic('urn:subject:1', 'urn:topic:1'))
    .next(topics[0])
    .put({ type: `${fetchArticle}`, payload: '1' })

    .next()
    .isDone();
});

test('topicSagas fetchTopics', () => {
  const token = '12345678';
  const saga = testSaga(sagas.fetchTopics, 1234);
  saga
    .next()
    .select(getAccessToken)
    .next(token)
    .call(api.fetchTopics, 1234, token)

    .next([{ id: '123', name: 'Algebra', parent: undefined }])
    .put({ type: actions.setTopics.toString(), payload: { topics: [{ id: '123', name: 'Algebra', parent: undefined }], subjectId: 1234 } })

    .next()
    .isDone();
});

test('topicSagas watchFetchTopics', () => {
  const saga = testSaga(sagas.watchFetchTopics);
  saga
    .next()
    .take(actions.fetchTopics)

    .next({ payload: { subjectId: 'urn:subject:1', topicId: 'urn:topic:1' } })

    .next(false)

    .call(sagas.fetchTopics, 'urn:subject:1')
    .next(topics)

    .parallel([
      call(sagas.fetchTopicArticle, 'urn:subject:1', 'urn:topic:1'),
      call(sagas.fetchTopicIntroductions, topics),
    ])
    .finish()
    .isDone();
});

test('topicSagas watchFetchTopics should not refetch topics', () => {
  const saga = testSaga(sagas.watchFetchTopics);
  saga
    .next()
    .take(actions.fetchTopics)

    .next({ payload: { subjectId: 1234 } })
    // .select(hasFetchedTopicsBySubjectId(1234))

    .next(true)
    .call(sagas.fetchTopicArticle, 1234, undefined)
    .finish()
    .isDone();
});

test('topicSagas fetchTopicIntroductions', () => {
  const mockTopics = [{ contentUri: 'urn:article:1' }, { contentUri: 'urn:learningpath:2' }, { contentUri: 'urn:article:1331' }, { id: 3 }];
  const token = '12345678';
  const saga = testSaga(sagas.fetchTopicIntroductions, mockTopics);
  const data = { results: [{ id: '1', intro: 'Test' }, { id: '1331', intro: 'Test' }] };
  saga
    .next()
    .select(getAccessToken)
    .next(token)
    .call(articleApi.fetchArticles, ['1', '1331'], token)

    .next(data)
    .put({ type: actions.setTopicIntroductions.toString(), payload: { topics: mockTopics, articleIntroductions: data.results } })

    .next()
    .isDone();
});

test('topicSagas fetchTopicIntroductions do not call fetchArticles if no valid ids', () => {
  const mockTopics = [{ contentUri: 'urn:learningpath:2' }];
  const saga = testSaga(sagas.fetchTopicIntroductions, mockTopics);
  saga
    .next()
    .isDone();
});
