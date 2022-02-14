/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLResource, GQLTopic } from '../graphqlTypes';
import { getContentType } from './getContentType';

export const getArticleProps = (
  resource: Pick<GQLResource, 'resourceTypes' | 'id'> | undefined,
  topic?: GQLTopic,
) => {
  const hasResourceTypes =
    resource?.resourceTypes && resource?.resourceTypes?.length > 0;

  const contentType =
    hasResourceTypes && resource ? getContentType(resource) : undefined;

  const additional =
    topic?.supplementaryResources?.some(item => item?.id === resource?.id) ??
    false;

  const label = (hasResourceTypes && resource?.resourceTypes![0]?.name) || '';
  return { contentType, label, additional };
};
