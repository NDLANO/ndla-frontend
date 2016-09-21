/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';
import { getLocale } from '../Locale/localeSelectors';
import { titlesI18N } from '../../util/i18nFieldFinder';

const getArticleFromState = state => state.article;

export const getArticle = createSelector(
    [getArticleFromState, getLocale],
    (article, locale) => ({
      ...article,
      title: titlesI18N(article, locale),
    })
);
