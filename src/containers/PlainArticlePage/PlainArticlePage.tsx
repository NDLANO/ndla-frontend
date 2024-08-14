/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import PlainArticleContainer, { plainArticleContainerFragments } from "./PlainArticleContainer";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import RedirectContext from "../../components/RedirectContext";
import ResponseContext from "../../components/ResponseContext";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLPlainArticlePageQuery, GQLPlainArticlePageQueryVariables } from "../../graphqlTypes";
import { TypedParams, useTypedParams } from "../../routeHelpers";
import { isAccessDeniedError } from "../../util/handleError";
import { useGraphQuery } from "../../util/runQueries";
import AccessDeniedPage from "../AccessDeniedPage/AccessDeniedPage";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import UnpublishedResource from "../UnpublishedResourcePage/UnpublishedResourcePage";

interface MatchParams extends TypedParams {
  articleId: string;
}

const plainArticlePageQuery = gql`
  query plainArticlePage($articleId: String!, $subjectId: String, $transformArgs: TransformedArticleContentInput) {
    article(id: $articleId) {
      ...PlainArticleContainer_Article
    }
  }
  ${plainArticleContainerFragments.article}
`;

const PlainArticlePage = () => {
  const { articleId } = useTypedParams<MatchParams>();
  const { pathname } = useLocation();
  const redirectContext = useContext(RedirectContext);
  const responseContext = useContext(ResponseContext);
  const { loading, data, error } = useGraphQuery<GQLPlainArticlePageQuery, GQLPlainArticlePageQueryVariables>(
    plainArticlePageQuery,
    {
      variables: {
        articleId,
        transformArgs: {
          showVisualElement: "true",
          path: pathname,
          isOembed: "false",
        },
      },
    },
  );

  if (loading) {
    return <ContentPlaceholder />;
  }
  if (error?.graphQLErrors.some((err) => err.extensions.status === 410) && redirectContext) {
    redirectContext.status = 410;
    return <UnpublishedResource />;
  }

  if (responseContext?.status === 410) {
    return <UnpublishedResource />;
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

  return <PlainArticleContainer article={data.article} skipToContentId={SKIP_TO_CONTENT_ID} />;
};

export default PlainArticlePage;
