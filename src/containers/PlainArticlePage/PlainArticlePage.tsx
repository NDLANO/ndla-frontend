/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom-v5-compat';
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
import { RootComponentProps } from '../../routes';
import { AuthContext } from '../../components/AuthenticationContext';
import { TypedParams, useTypedParams } from '../../routeHelpers';

interface MatchParams extends TypedParams {
  articleId: string;
}

const plainArticlePageQuery = gql`
  query plainArticlePage(
    $articleId: String!
    $isOembed: String
    $path: String
  ) {
    article(id: $articleId, isOembed: $isOembed, path: $path) {
      ...PlainArticleContainer_Article
    }
  }
  ${plainArticleContainerFragments.article}
`;

interface Props extends RootComponentProps {}
const PlainArticlePage = ({ locale, skipToContentId }: Props) => {
  const { user } = useContext(AuthContext);
  const { articleId } = useTypedParams<MatchParams>();
  const { pathname } = useLocation();
  const { loading, data, error } = useGraphQuery<
    GQLPlainArticlePageQuery,
    GQLPlainArticlePageQueryVariables
  >(plainArticlePageQuery, {
    variables: { articleId, isOembed: 'false', path: pathname },
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
      locale={locale}
      user={user}
      skipToContentId={skipToContentId}
    />
  );
};

export default PlainArticlePage;
