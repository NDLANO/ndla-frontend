/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { combineReducers } from 'redux';

import locale from './containers/Locale/localeReducer';
import subjects from './containers/SubjectPage/subjects';
import filters from './containers/Filters/filter';
import search from './containers/SearchPage/searchReducer';
import errors from './modules/error';

const rootReducers = combineReducers({
  errors,
  locale,
  search,
  subjects,
  filters,
});

export default rootReducers;
