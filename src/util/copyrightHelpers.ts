import { getGroupedContributorDescriptionList } from '@ndla/licenses';
import { GQLContributor } from '../graphqlTypes';

export const getPrioritizedAuthors = (authors: {
  creators: GQLContributor[];
  rightsholders: GQLContributor[];
  processors: GQLContributor[];
}): GQLContributor[] => {
  const { creators, rightsholders, processors } = authors;

  if (creators.length || rightsholders.length) {
    return [...creators, ...rightsholders];
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
  return getGroupedContributorDescriptionList(authors, language).map(item => ({
    name: item.description,
    type: item.label,
  }));
};
