/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import handleError from './util/handleError';
import rootSaga from './sagas';

import rootReducer from './reducers';

export const STORE_KEY = '__REDUX_STORE__';

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware({
    onError: error => {
      handleError(error);
    },
  });

  const createFinalStore = compose(
    applyMiddleware(sagaMiddleware),
    process.env.BUILD_TARGET === 'client' && window && window.devToolsExtension
      ? window.devToolsExtension()
      : f => f,
  )(createStore);

  const store = createFinalStore(rootReducer, initialState);

  store.sagaTask = sagaMiddleware.run(rootSaga);

  if (process.env.BUILD_TARGET === 'client') {
    window[STORE_KEY] = store;
  }
  return store;
}
