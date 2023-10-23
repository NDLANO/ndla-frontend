/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ApolloCache,
  ApolloError,
  gql,
  QueryHookOptions,
  Reference,
  useApolloClient,
  useMutation,
} from '@apollo/client';
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
export const arenaPageQuery = gql`
  query arenaPage {
    arenaCategories(){
      ...ArenaPageQueryFragment
    }
    ${arenaPageQueryFragment}
  }
`;
