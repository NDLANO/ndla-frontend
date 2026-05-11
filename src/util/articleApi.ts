/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArticleV2DTO } from "@ndla/types-backend/article-api";
import { OembedResponse } from "../interfaces";
import { apiResourceUrl, resolveJsonOrRejectWithError } from "./apiHelpers";
import { StatusError } from "./error/StatusError";

const baseUrl = apiResourceUrl("/article-api/v2/articles");

export const fetchArticle = (id: string | number, locale: string): Promise<ArticleV2DTO> =>
  fetch(`${baseUrl}/${id}?lang=${locale}&fallback=true`).then(
    (r) => resolveJsonOrRejectWithError(r) as Promise<ArticleV2DTO>,
  );

export const fetchArticleOembed = (url: string): Promise<OembedResponse> =>
  fetch(`/oembed?url=${url}`).then((r) => resolveJsonOrRejectWithError(r) as Promise<OembedResponse>);

export const fetchArticleRss = async (slug: string): Promise<string> => {
  const response = await fetch(`${baseUrl}/${slug}/rss.xml`);
  if (!response.ok) {
    throw new StatusError(
      `Got error with status ${response.status} when requesting '${response.url}'`,
      response.status,
    );
  }
  return response.text();
};
