/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import testSaga from 'redux-saga-test-plan';
import * as sagas from '../topicSagas';
import * as api from '../topicApi';
import * as articleApi from '../../ArticlePage/articleApi';
import * as constants from '../topicConstants';
import * as actions from '../topicActions';
// import { hasFetchedTopicsBySubjectId } from '../topicSelectors';


test('topicSagas fetchTopics', () => {
  const saga = testSaga(sagas.fetchTopics, 1234);
  saga
    .next()
    .call(api.fetchTopics, 1234)

    .next([{ id: '123', name: 'Algebra', parent: undefined }])
    .put({ type: constants.SET_TOPICS, payload: { topics: [{ id: '123', name: 'Algebra', parent: undefined }], subjectId: 1234 } })

    .next()
    .isDone();
});

test('topicSagas watchFetchTopics ', () => {
  const saga = testSaga(sagas.watchFetchTopics);
  saga
    .next()
    .take(actions.fetchTopics)

    .next({ payload: { subjectId: 1234 } })
    // .select(hasFetchedTopicsBySubjectId(1234))

    .next(false)
    .call(sagas.fetchTopics, 1234, undefined)

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

    .finish()
    .isDone();
});

test('topicSagas watchFetchTopicResources', () => {
  const saga = testSaga(sagas.watchFetchTopicResources);
  saga
    .next()
    .take(actions.fetchTopicResources)

    .next({ payload: { subjectId: 1, topicId: 2 } })
    .next([{ id: 1 }, { id: 3 }])
    .call(sagas.fetchTopicIntroductions, [{ id: 1 }, { id: 3 }])

    .finish()
    .next()
    .isDone();
});

test('topicSagas fetchTopicIntroductions', () => {
  const topics = [{ contentUri: 'urn:article:1' }, { contentUri: 'urn:learningpath:2' }, { contentUri: 'urn:article:1331' }, { id: 3 }];
  const saga = testSaga(sagas.fetchTopicIntroductions, topics);
  const data = { results: [{ id: '1', intro: 'Test' }, { id: '1331', intro: 'Test' }] };
  saga
    .next()
    .call(articleApi.fetchArticles, ['1', '1331'])

    .next(data)
    .put({ type: constants.SET_TOPIC_INTRODUCTIONS, payload: { topics, articleIntroductions: data.results } })

    .next()
    .isDone();
});

test('topicSagas fetchTopicIntroductions do not call fetchArticles if no valid ids', () => {
  const topics = [{ contentUri: 'urn:learningpath:2' }];
  const saga = testSaga(sagas.fetchTopicIntroductions, topics);
  saga
    .next()
    .isDone();
});
