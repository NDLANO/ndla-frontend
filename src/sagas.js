/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { spawn } from 'redux-saga/effects';
import articleSagas from './containers/ArticlePage/articleSagas';
import searchSagas from './containers/SearchPage/searchSagas';
import subjectSagas from './containers/SubjectPage/subjectSagas';
import topicSagas from './containers/TopicPage/topicSagas';
import resourceSagas from './containers/Resources/resourceSagas';

export default function* root() {
  yield [
    ...articleSagas.map(s => spawn(s)),
    ...searchSagas.map(s => spawn(s)),
    ...subjectSagas.map(s => spawn(s)),
    ...topicSagas.map(s => spawn(s)),
    ...resourceSagas.map(s => spawn(s)),
  ];
}
