/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { combineReducers } from 'redux';

import locale from './containers/Locale/localeReducer';
import messages from './containers/Messages/messagesReducer';
import articles from './containers/ArticlePage/article';
import subjects from './containers/SubjectPage/subjects';
import topics from './containers/TopicPage/topic';
import filters from './containers/Filters/filter';
import search from './containers/SearchPage/searchReducer';
import resources from './containers/Resources/resource';
import errors from './modules/error';

const rootReducers = combineReducers({
  articles,
  errors,
  locale,
  messages,
  resources,
  search,
  subjects,
  topics,
  filters,
});

export default rootReducers;
