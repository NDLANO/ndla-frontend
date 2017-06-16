/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchWithAccessToken,
} from '../../util/apiHelpers';

const converterBaseUrl = apiResourceUrl('/article-converter/json');
const baseUrl = apiResourceUrl('/article-api/v1/articles');

export const fetchArticle = (id, locale) =>
  fetchWithAccessToken(`${converterBaseUrl}/${locale}/${id}`).then(
    resolveJsonOrRejectWithError,
  );

export const fetchArticles = ids =>
  fetchWithAccessToken(`${baseUrl}?ids=${ids.join(',')}`).then(
    resolveJsonOrRejectWithError,
  );
