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

export const fetchArticle = createAction('FETCH_ARTICLE');
export const fetchArticleError = createAction('FETCH_ARTICLE_ERROR');
export const fetchArticleSuccess = createAction('FETCH_ARTICLE_SUCCESS');
export const setArticle = createAction('SET_ARTICLE');
export const actions = {
  fetchArticleError,
  fetchArticle,
  setArticle,
  fetchArticleSuccess,
};

const initalState = {
  all: {},
  isLoading: false,
  error: undefined,
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
        isLoading: true,
      }),
      throw: state => state,
    },
    [actions.fetchArticleError]: {
      next: (state, action) => ({
        ...state,
        isLoading: false,
        error: action.payload.error,
      }),
      throw: state => state,
    },
    [actions.fetchArticleSuccess]: {
      next: state => ({
        ...state,
        isLoading: false,
        error: undefined,
      }),
      throw: state => state,
    },
  },
  initalState,
);

const getArticlesFromState = state => state.articles;

export const getArticleById = articleId =>
  createSelector([getArticlesFromState], articles => articles.all[articleId]);

export const hasArticleFetchFailed = state =>
  state.articles.error !== undefined;

export const getArticle = articleId =>
  createSelector(
    [getArticleById(articleId), getLocale],
    (article, locale) =>
      article
        ? {
            ...article,
            created: formatDate(article.created, locale),
            updated: formatDate(article.updated, locale),
            footNotes: defined(article.footNotes, {}),
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
          }
        : undefined,
  );
