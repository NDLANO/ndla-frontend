/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import locale from './locale/localeReducer';
import messages from './messages/messagesReducer';
import article from './article/articleReducer';
import search from './search/searchReducer';

const rootReducers = combineReducers({
  locale,
  messages,
  article,
  search,
  routing: routerReducer,
});

export default rootReducers;
