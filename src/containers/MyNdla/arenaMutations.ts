/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import {
  GQLArenaCategoriesQuery,
  GQLArenaCategoryQuery,
  GQLArenaTopicQuery,
} from '../../graphqlTypes';
import { useGraphQuery } from '../../util/runQueries';

const arenaCategoriesFragment = gql`
  fragment ArenaCategoriesFragment on ArenaCategory {
    __typename
    description
    disabled
    htmlDescription
    id
    name
    postCount
    slug
  }
`;

const arenaCategoryFragment = gql`
  fragment ArenaCategoryFragment on ArenaCategory {
    __typename
    description
    disabled
    htmlDescription
    id
    name
    postCount
    slug
  }
`;

const arenaTopicFragment = gql`
  fragment ArenaTopicFragment on ArenaTopic {
    __typename
    categoryId
    id
    locked
    postCount
    slug
    timestamp
    title
  }
`;

const arenaPostFragment = gql`
  fragment ArenaPostFragment on ArenaPost {
    __typename
    content
    id
    timestamp
    topicId
  }
`;

export const arenaCategoriesQuery = gql`
  query arenaPage {
    arenaCategories {
      ...ArenaCategoriesFragment
    }
  }
  ${arenaCategoriesFragment}
`;

export const arenaCategoryQuery = gql`
  query arenaCategory($categoryId: Int!, $page: Int!) {
    arenaCategory(categoryId: $categoryId, page: $page) {
      ...ArenaCategoryFragment
      topics {
        ...ArenaTopicFragment
      }
      topicCount
    }
  }
  ${arenaCategoryFragment}
  ${arenaTopicFragment}
`;

export const arenaTopicById = gql`
  query arenaTopicById($topicId: Int!, $page: Int!) {
    arenaTopic(topicId: $topicId, page: $page) {
      ...ArenaTopicFragment
      posts {
        ...ArenaPostFragment
      }
    }
  }
  ${arenaTopicFragment}
  ${arenaPostFragment}
`;

export const useArenaCategories = () => {
  const { data, loading, error } =
    useGraphQuery<GQLArenaCategoriesQuery>(arenaCategoriesQuery);
  return { data, loading, error };
};

export const useArenaCategory = (categoryId: number, page: number) => {
  const { data, loading, error } = useGraphQuery<GQLArenaCategoryQuery>(
    arenaCategoryQuery,
    {
      variables: { categoryId, page },
    },
  );
  return { data, loading, error };
};

export const useArenaTopic = (topicId: number, page: number) => {
  const { data, loading, error } = useGraphQuery<GQLArenaTopicQuery>(
    arenaTopicById,
    {
      variables: { topicId, page },
    },
  );
  return { data, loading, error };
};
