/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';

import rootReducer from './reducers';

import { errorReporter } from './middleware';


export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();

  const createFinalStore = compose(
    applyMiddleware(
      sagaMiddleware,
      errorReporter,
    ),
    __CLIENT__ && window && window.devToolsExtension ? window.devToolsExtension() : f => f,
  )(createStore);

  const store = createFinalStore(rootReducer, initialState);

  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);

  return store;
}
