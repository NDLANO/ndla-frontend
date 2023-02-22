/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { Spinner } from '@ndla/icons';
import { useDisableConverter } from '../../../components/ArticleConverterContext';
import {
  GQLFolderResource,
  GQLFolderResourceMetaSearchQuery,
  GQLSharedResourceArticlePageQuery,
  GQLSharedResourceArticlePageQueryVariables,
} from '../../../graphqlTypes';
import { getArticleProps } from '../../../util/getArticleProps';
import { useGraphQuery } from '../../../util/runQueries';
import ErrorPage from '../../ErrorPage';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import SharedResourceContainer, {
  sharedArticleContainerFragments,
} from './SharedResourceContainer';

const sharedResourceArticlePageQuery = gql`
  query sharedResourceArticlePage(
    $articleId: String!
    $isOembed: String
    $path: String
    $showVisualElement: String
    $convertEmbeds: Boolean
  ) {
    article(
      id: $articleId
      isOembed: $isOembed
      path: $path
      showVisualElement: $showVisualElement
      convertEmbeds: $convertEmbeds
    ) {
      ...SharedResourceArticleContainer_Article
    }
  }
  ${sharedArticleContainerFragments.article}
`;

interface Props {
  resource: GQLFolderResource;
  meta?: GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0];
  loading?: boolean;
}

const SharedArticle = ({ resource, meta }: Props) => {
  const disableConverter = useDisableConverter();

  const { loading, data, error } = useGraphQuery<
    GQLSharedResourceArticlePageQuery,
    GQLSharedResourceArticlePageQueryVariables
  >(sharedResourceArticlePageQuery, {
    variables: {
      articleId: `${resource.resourceId}`,
      isOembed: 'false',
      path: resource.path,
      showVisualElement: 'true',
      convertEmbeds: disableConverter,
    },
  });

  const article = data?.article;

  if (loading) {
    return <Spinner />;
  }
  if (!article) return <NotFoundPage />;
  if (error) {
    return <ErrorPage />;
  }
  return (
    <div>
      <SharedResourceContainer
        article={article}
        meta={meta}
        {...getArticleProps(undefined, undefined)}
      />
    </div>
  );
};

export default SharedArticle;
