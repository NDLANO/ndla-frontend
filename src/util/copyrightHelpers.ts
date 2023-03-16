/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getGroupedContributorDescriptionList } from '@ndla/licenses';
import { GQLContributor } from '../graphqlTypes';

export const getPrioritizedAuthors = (authors: {
  creators: GQLContributor[];
  rightsholders: GQLContributor[];
  processors: GQLContributor[];
}): GQLContributor[] => {
  const { creators = [], rightsholders = [], processors = [] } = authors;

  if (creators.length || rightsholders.length) {
    return creators.concat(rightsholders);
  }
  return processors;
};

export const getGroupedAuthors = (
  authors: {
    creators: GQLContributor[];
    rightsholders: GQLContributor[];
    processors: GQLContributor[];
  },
  language: string,
) => {
  return getGroupedContributorDescriptionList(authors, language).map(
    (item) => ({
      name: item.description,
      type: item.label,
    }),
  );
};
