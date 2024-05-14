/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticleV2 } from "@ndla/types-backend/article-api";
import { OembedResponse } from "../../interfaces";
import { resolveJsonOrRejectWithError, apiResourceUrl } from "../../util/apiHelpers";

const baseUrl = apiResourceUrl("/article-api/v2/articles");

export const fetchArticle = (id: string | number, locale: string): Promise<IArticleV2> =>
  fetch(`${baseUrl}/${id}?lang=${locale}&fallback=true`).then(
    (r) => resolveJsonOrRejectWithError(r) as Promise<IArticleV2>,
  );

export const fetchArticleOembed = (url: string): Promise<OembedResponse> =>
  fetch(`/oembed?url=${url}`).then((r) => resolveJsonOrRejectWithError(r) as Promise<OembedResponse>);
