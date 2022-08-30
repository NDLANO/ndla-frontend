/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ContentPlaceholder } from '@ndla/ui';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useGraphQuery } from '../../util/runQueries';
import { isAccessDeniedError } from '../../util/handleError';
import AccessDeniedPage from '../AccessDeniedPage/AccessDeniedPage';
import PlainArticleContainer, {
  plainArticleContainerFragments,
} from './PlainArticleContainer';
import {
  GQLPlainArticlePageQuery,
  GQLPlainArticlePageQueryVariables,
} from '../../graphqlTypes';
import { AuthContext } from '../../components/AuthenticationContext';
import { TypedParams, useTypedParams } from '../../routeHelpers';
import { SKIP_TO_CONTENT_ID } from '../../constants';

interface MatchParams extends TypedParams {
  articleId: string;
}

const plainArticlePageQuery = gql`
  query plainArticlePage(
    $articleId: String!
    $isOembed: String
    $path: String
    $showVisualElement: String
  ) {
    article(
      id: $articleId
      isOembed: $isOembed
      path: $path
      showVisualElement: $showVisualElement
    ) {
      ...PlainArticleContainer_Article
    }
  }
  ${plainArticleContainerFragments.article}
`;

const PlainArticlePage = () => {
  const { user } = useContext(AuthContext);
  const { articleId } = useTypedParams<MatchParams>();
  const { pathname } = useLocation();
  const { loading, data, error } = useGraphQuery<
    GQLPlainArticlePageQuery,
    GQLPlainArticlePageQueryVariables
  >(plainArticlePageQuery, {
    variables: {
      articleId,
      isOembed: 'false',
      path: pathname,
      showVisualElement: 'true',
    },
  });

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (error) {
    if (isAccessDeniedError(error)) {
      return <AccessDeniedPage />;
    }
    return <DefaultErrorMessage />;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  if (!data.article) {
    return <NotFoundPage />;
  }

  return (
    <PlainArticleContainer
      article={data.article}
      user={user}
      skipToContentId={SKIP_TO_CONTENT_ID}
    />
  );
};

export default PlainArticlePage;
