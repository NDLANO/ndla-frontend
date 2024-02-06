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
import { ContentPlaceholder } from "@ndla/ui";
import PlainArticleContainer, { plainArticleContainerFragments } from "./PlainArticleContainer";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import RedirectContext from "../../components/RedirectContext";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLPlainArticlePageQuery, GQLPlainArticlePageQueryVariables } from "../../graphqlTypes";
import { TypedParams, useTypedParams } from "../../routeHelpers";
import { isAccessDeniedError } from "../../util/handleError";
import { useGraphQuery } from "../../util/runQueries";
import AccessDeniedPage from "../AccessDeniedPage/AccessDeniedPage";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

interface MatchParams extends TypedParams {
  articleId: string;
}

const plainArticlePageQuery = gql`
  query plainArticlePage(
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
      ...PlainArticleContainer_Article
    }
  }
  ${plainArticleContainerFragments.article}
`;

const PlainArticlePage = () => {
  const { articleId } = useTypedParams<MatchParams>();
  const { pathname } = useLocation();
  const redirectContext = useContext(RedirectContext);
  const { loading, data, error } = useGraphQuery<GQLPlainArticlePageQuery, GQLPlainArticlePageQueryVariables>(
    plainArticlePageQuery,
    {
      variables: {
        articleId,
        isOembed: "false",
        path: pathname,
        showVisualElement: "true",
        convertEmbeds: true,
      },
    },
  );

  if (loading) {
    return <ContentPlaceholder />;
  }
  if (error?.graphQLErrors.some((err) => err.extensions.status === 410) && redirectContext) {
    redirectContext.status = 410;
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
