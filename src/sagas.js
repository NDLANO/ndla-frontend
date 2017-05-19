/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { all, fork } from 'redux-saga/effects';
import articleSagas from './containers/ArticlePage/articleSagas';
import searchSagas from './containers/SearchPage/searchSagas';
import subjectSagas from './containers/SubjectPage/subjectSagas';
import topicSagas from './containers/TopicPage/topicSagas';
import resourceSagas from './containers/Resources/resourceSagas';
import sessionSagas from './containers/App/sessionSagas';

export default function* root() {
  yield all([
    ...articleSagas.map(s => fork(s)),
    ...searchSagas.map(s => fork(s)),
    ...subjectSagas.map(s => fork(s)),
    ...topicSagas.map(s => fork(s)),
    ...resourceSagas.map(s => fork(s)),
    ...sessionSagas.map(s => fork(s)),
  ]);
}
