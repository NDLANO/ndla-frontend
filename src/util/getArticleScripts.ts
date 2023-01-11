/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLArticle } from '../graphqlTypes';

export interface Scripts {
  key?: string;
  src?: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
}

export function getArticleScripts(
  article: Pick<GQLArticle, 'requiredLibraries' | 'content'>,
) {
  const scripts: Array<Scripts> =
    article.requiredLibraries?.map(lib => ({
      src: lib.url,
      type: lib.mediaType,
    })) || [];

  return scripts;
}
