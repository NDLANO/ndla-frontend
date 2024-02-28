/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { resolveJsonOrRejectWithError, apiResourceUrl, fetch } from "../../util/apiHelpers";

const baseUrl = apiResourceUrl("/article-api/v2/articles");

export const fetchArticle = (id, locale) =>
  fetch(`${baseUrl}/${id}?lang=${locale}&fallback=true`).then(resolveJsonOrRejectWithError);

export const fetchArticleOembed = (url) => fetch(`/oembed?url=${url}`).then(resolveJsonOrRejectWithError);
