/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-unfetch';
import './raf-polyfill';

/* eslint-disable */

import { expectSaga } from 'redux-saga-test-plan';

global.__CLIENT__ = false;
global.__SERVER__ = true;

// fix: `matchMedia` not present, legacy browsers require a polyfill
global.matchMedia =
  global.matchMedia ||
  function() {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };

/* eslint-enable */

window.DATA = {
  config: {
    ndlaApiUrl: 'http://ndla-api',
  },
};

// polyfill for jsdom
window.matchMedia =
  window.matchMedia ||
  function matchMedia() {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };

jest.mock('../style/index.css', () => {});

global.DEFAULT_TIMEOUT = process.env.DEFAULT_TIMEOUT
  ? parseInt(process.env.DEFAULT_TIMEOUT, 10)
  : 250;
expectSaga.DEFAULT_TIMEOUT = global.DEFAULT_TIMEOUT;

const localStorageMock = (function createLocalStorage() {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

localStorage.setItem('access_token', '123456789');
localStorage.setItem(
  'access_token_expires_at',
  new Date().getTime() + 24 * 60 * 60 * 1000,
);
localStorage.setItem('id_token', '12345678');
localStorage.setItem(
  'id_token_expires_at',
  new Date().getTime() + 24 * 60 * 60 * 1000,
);
