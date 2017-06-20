/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { all, take, call, put, select } from 'redux-saga/effects';
import * as api from './resourceApi';
import { actions, getResourcesByTopicId } from './resource';
import { getLocale } from '../Locale/localeSelectors';

export function* fetchResourceTypes() {
  try {
    const locale = yield select(getLocale);
    const resourceTypes = yield call(api.fetchResourceTypes, locale);
    yield put(actions.setResourceTypes(resourceTypes));
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* fetchTopicResources(topicId) {
  try {
    const locale = yield select(getLocale);
    const resources = yield call(api.fetchTopicResources, topicId, locale);
    yield put(actions.setTopicResources({ topicId, resources }));
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchTopicResources() {
  while (true) {
    const { payload: { topicId } } = yield take(actions.fetchTopicResources);
    const resources = yield select(getResourcesByTopicId(topicId));
    if (resources.length === 0) {
      yield all([call(fetchTopicResources, topicId), call(fetchResourceTypes)]);
    }
  }
}

export default [watchFetchTopicResources];
