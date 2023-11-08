/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { GQLArenaPageQuery, GQLTopicPageQuery } from '../../graphqlTypes';
import { useGraphQuery } from '../../util/runQueries';

const arenaPageQueryFragment = gql`
  fragment ArenaPageQueryFragment on ArenaCategory {
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

const topicPageQueryFragment = gql`
  fragment TopicPageQueryFragment on ArenaTopic {
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

export const arenaPageQuery = gql`
  query arenaPage {
    arenaCategories {
      ...ArenaPageQueryFragment
    }
  }
  ${arenaPageQueryFragment}
`;

export const topicPageQuery = gql`
  query topicPage {
    arenaTopics {
      ...TopicPageQueryFragment
    }
  }
  ${topicPageQueryFragment}
`;

export const useCategories = () => {
  const { data, loading, error } =
    useGraphQuery<GQLArenaPageQuery>(arenaPageQuery);
  return { arenaCategories: data, loading, error };
};

export const useTopics = () => {
  const { data, loading, error } =
    useGraphQuery<GQLTopicPageQuery>(topicPageQuery);
  return { arenaTopics: data, loading, error };
};
