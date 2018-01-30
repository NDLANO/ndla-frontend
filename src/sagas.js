/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { all, fork as forkEffect, spawn, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import articleSagas from './containers/ArticlePage/articleSagas';
import searchSagas from './containers/SearchPage/searchSagas';
import subjectSagas from './containers/SubjectPage/subjectSagas';
import topicSagas from './containers/TopicPage/topicSagas';
import filterSagas from './containers/Filters/filterSagas';
import resourceSagas from './containers/Resources/resourceSagas';
import errorSagas from './modules/error/errorSagas';
import handleError from './util/handleError';
import BackoffTime from './util/BackoffTime';

const makeFork = saga =>
  // Need to use standard fork on server for SSR to work
  forkEffect(function* nonRestartable() {
    try {
      yield call(saga);
    } catch (e) {
      handleError(e);
    }
  });

const makeRestartable = saga =>
  // Can use spawn instead of fork on client
  spawn(function* restartable() {
    const backoffTime = new BackoffTime();
    while (true) {
      try {
        yield call(saga);
        handleError(
          new Error(
            'Unexpected saga termination. This saga is supposed to live during the whole app lifetime.',
          ),
        );
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Saga error, the saga will be restarted.'); // eslint-disable-line no-console
        }
        handleError(e);
      }
      yield delay(backoffTime.getExponentialDelay()); // Avoid infinite failures blocking app
    }
  });

const fork = __SERVER__ ? makeFork : makeRestartable;

export default function* root() {
  yield all([
    ...articleSagas.map(s => fork(s)),
    ...searchSagas.map(s => fork(s)),
    ...subjectSagas.map(s => fork(s)),
    ...topicSagas.map(s => fork(s)),
    ...filterSagas.map(s => fork(s)),
    ...resourceSagas.map(s => fork(s)),
    ...errorSagas.map(s => fork(s)),
  ]);
}
