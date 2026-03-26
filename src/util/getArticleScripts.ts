/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLArticleRequiredLibrary, GQLTransformedArticleContent } from "../graphqlTypes";

export interface Scripts {
  key?: string;
  src?: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
}

interface BaseArticle {
  requiredLibraries?: GQLArticleRequiredLibrary[];
  transformedContent: Pick<GQLTransformedArticleContent, "content">;
}

export function getArticleScripts(article: BaseArticle) {
  const scripts: Array<Scripts> =
    article.requiredLibraries?.map((lib) => ({
      src: lib.url,
      type: lib.mediaType,
    })) || [];

  if (article && article.transformedContent?.content.indexOf('data-resource="h5p"') > -1) {
    scripts.push({
      src: "/static/h5p-resizer.js",
      type: "text/javascript",
      async: true,
      defer: true,
    });
  }

  return scripts;
}
