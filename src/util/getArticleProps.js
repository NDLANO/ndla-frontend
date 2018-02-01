/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import getContentTypeFromResourceTypes from './getContentTypeFromResourceTypes';

export const getArticleProps = article => {
  const hasResourceTypes =
    article && article.resourceTypes && article.resourceTypes.length > 0;

  const contentType = hasResourceTypes
    ? getContentTypeFromResourceTypes(article.resourceTypes).contentType
    : undefined;

  const label = hasResourceTypes ? article.resourceTypes[0].name : '';
  return { contentType, label };
};
