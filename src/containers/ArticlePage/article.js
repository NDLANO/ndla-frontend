/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';
import { createSelector } from 'reselect';
import { getLocale } from '../Locale/localeSelectors';
import { transformArticle } from '../../util/transformArticle';
import createFetchActions from '../../util/createFetchActions';

export const fetchArticleActions = createFetchActions('ARTICLE');
export const setArticle = createAction('SET_ARTICLE');
export const actions = {
  ...fetchArticleActions,
  setArticle,
};

const initalState = {
  all: {},
  status: 'initial',
};

export default handleActions(
  {
    [actions.setArticle]: {
      next: (state, action) => ({
        ...state,
        all: { ...state.all, [action.payload.id]: { ...action.payload } },
      }),
      throw: state => state,
    },
    [actions.fetchingArticle]: {
      next: state => ({
        ...state,
        status: 'loading',
      }),
      throw: state => state,
    },
    [actions.fetchArticleError]: {
      next: (state, action) => ({
        ...state,
        status:
          action.payload.error.json && action.payload.error.json.status === 404
            ? 'error404'
            : 'error',
      }),
      throw: state => state,
    },
    [actions.fetchArticleSuccess]: {
      next: state => ({
        ...state,
        status: 'success',
      }),
      throw: state => state,
    },
  },
  initalState,
);

const getArticlesFromState = state => state.articles;

export const getArticleById = articleId =>
  createSelector([getArticlesFromState], articles => articles.all[articleId]);

export const getFetchStatus = state => state.articles.status;

export const getArticle = articleId =>
  createSelector([getArticleById(articleId), getLocale], (article, locale) => {
    if (article) {
      return transformArticle(article, locale);
    }
    return undefined;
  });
