/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useGraphQuery } from '../../util/runQueries';
import { isAccessDeniedError } from '../../util/handleError';
import AccessDeniedPage from '../AccessDeniedPage/AccessDeniedPage';
import PlainArticleContainer from './PlainArticleContainer';
import { plainArticleQuery } from '../../queries';
import { GQLPlainArticleQuery } from '../../graphqlTypes';
import { RootComponentProps } from '../../routes';
import { AuthContext } from '../../components/AuthenticationContext';

interface MatchParams {
  articleId: string;
}

interface Props extends RootComponentProps, RouteComponentProps<MatchParams> {}
const PlainArticlePage = ({ locale, match, skipToContentId }: Props) => {
  const { user } = useContext(AuthContext);
  const {
    url,
    params: { articleId },
  } = match;
  const { loading, data, error } = useGraphQuery<GQLPlainArticleQuery>(
    plainArticleQuery,
    {
      variables: { articleId, isOembed: 'false', path: url },
    },
  );

  if (loading) {
    return null;
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

export default withRouter(PlainArticlePage);
