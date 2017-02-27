/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import locale from './containers/Locale/localeReducer';
import messages from './containers/Messages/messagesReducer';
import articles from './containers/ArticlePage/articlesReducer';
import subjects from './containers/SubjectPage/subjectReducer';
import topics from './containers/TopicPage/topicReducer';
import search from './containers/SearchPage/searchReducer';

const rootReducers = combineReducers({
  locale,
  messages,
  articles,
  search,
  subjects,
  topics,
  routing: routerReducer,
});

export default rootReducers;
