/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useLocation } from "react-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import PlainArticleContainer, { plainArticleContainerFragments } from "./PlainArticleContainer";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import RedirectContext from "../../components/RedirectContext";
import ResponseContext from "../../components/ResponseContext";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLPlainArticlePageQuery, GQLPlainArticlePageQueryVariables } from "../../graphqlTypes";
import { TypedParams, useTypedParams } from "../../routeHelpers";
import { isAccessDeniedError, isGoneError, isNotFoundError } from "../../util/handleError";
import { AccessDeniedPage } from "../AccessDeniedPage/AccessDeniedPage";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import { UnpublishedResourcePage } from "../UnpublishedResourcePage/UnpublishedResourcePage";

interface MatchParams extends TypedParams {
  articleId: string;
}

const plainArticlePageQuery = gql`
  query plainArticlePage($articleId: String!, $transformArgs: TransformedArticleContentInput) {
    article(id: $articleId) {
      ...PlainArticleContainer_Article
    }
  }
  ${plainArticleContainerFragments.article}
`;

export const PlainArticlePage = () => {
  const { articleId } = useTypedParams<MatchParams>();
  const { pathname } = useLocation();
  const redirectContext = useContext(RedirectContext);
  const responseContext = useContext(ResponseContext);
  const { loading, data, error } = useQuery<GQLPlainArticlePageQuery, GQLPlainArticlePageQueryVariables>(
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
    return <ContentPlaceholder variant="article" />;
  }
  if (isGoneError(error) && redirectContext) {
    redirectContext.status = 410;
    return <UnpublishedResourcePage />;
  }

  if (responseContext?.status === 410) {
    return <UnpublishedResourcePage />;
  }

  if (error) {
    if (isAccessDeniedError(error)) {
      return <AccessDeniedPage />;
    }
    if (isNotFoundError(error)) {
      return <NotFoundPage />;
    }
    return <DefaultErrorMessagePage />;
  }

  if (!data) {
    return <DefaultErrorMessagePage />;
  }

  if (!data.article) {
    return <NotFoundPage />;
  }

  return <PlainArticleContainer key={data.article.id} article={data.article} skipToContentId={SKIP_TO_CONTENT_ID} />;
};

export const Component = PlainArticlePage;
