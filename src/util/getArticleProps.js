/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import getContentTypeFromResourceTypes from './getContentTypeFromResourceTypes';

export const getArticleProps = (resource, topic) => {
  const hasResourceTypes =
    resource && resource.resourceTypes && resource.resourceTypes.length > 0;

  const contentType = hasResourceTypes
    ? getContentTypeFromResourceTypes(resource.resourceTypes).contentType
    : undefined;

  const additional = topic
    ? topic.supplementaryResources.some(item => item.id === resource.id)
    : false;

  const label = hasResourceTypes ? resource.resourceTypes[0].name : '';
  return { contentType, label, additional };
};
