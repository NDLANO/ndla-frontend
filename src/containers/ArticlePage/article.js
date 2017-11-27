/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';
import defined from 'defined';
import { createSelector } from 'reselect';
import { getLocale } from '../Locale/localeSelectors';
import formatDate from '../../util/formatDate';
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

export const hasFetchArticleFailed = state => state.articles.fetchArticleFailed;

export const getFetchStatus = state => state.articles.status;

export const getArticle = articleId =>
  createSelector([getArticleById(articleId), getLocale], (article, locale) => {
    if (article) {
      const footNotes = defined(article.metaData.footnotes, []);
      return {
        ...article,
        created: formatDate(article.created, locale),
        updated: formatDate(article.updated, locale),
        footNotes: footNotes.reduce((acc, note) => ({ ...acc, ...note }), {}),
        requiredLibraries: article.requiredLibraries
          ? article.requiredLibraries.map(lib => {
              if (lib.url.startsWith('http://')) {
                return {
                  ...lib,
                  url: lib.url.replace('http://', 'https://'),
                };
              }
              return lib;
            })
          : [],
      };
    }
    return undefined;
  });
