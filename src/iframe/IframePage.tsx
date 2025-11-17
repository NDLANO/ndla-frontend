/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  ErrorMessageContent,
  ErrorMessageDescription,
  ErrorMessageRoot,
  ErrorMessageTitle,
  PageContainer,
} from "@ndla/primitives";
import { IframeArticlePage, iframeArticlePageFragments } from "./IframeArticlePage";
import { PageTitle } from "../components/PageTitle";
import { RedirectContext } from "../components/RedirectContext";
import { Status } from "../components/Status";
import { SKIP_TO_CONTENT_ID } from "../constants";
import { NotFoundPage } from "../containers/NotFoundPage/NotFoundPage";
import { GQLIframePageQuery, GQLIframePageQueryVariables } from "../graphqlTypes";
import { INTERNAL_SERVER_ERROR } from "../statusCodes";
import "../style/index.css";
import { isGoneError } from "../util/handleError";

const Error = () => {
  const { t } = useTranslation();

  return (
    <PageContainer asChild consumeCss>
      <main>
        <PageTitle title={t("htmlTitles.errorPage")} />
        <Status code={INTERNAL_SERVER_ERROR}>
          <ErrorMessageRoot>
            <img src="/static/oops.gif" alt={t("errorMessage.title")} />
            <ErrorMessageContent>
              <ErrorMessageTitle id={SKIP_TO_CONTENT_ID}>{t("errorMessage.title")}</ErrorMessageTitle>
              <ErrorMessageDescription>{t("errorMessage.description")}</ErrorMessageDescription>
            </ErrorMessageContent>
          </ErrorMessageRoot>
        </Status>
      </main>
    </PageContainer>
  );
};

interface Props {
  articleId?: string;
  taxonomyId?: string;
  isOembed?: string;
}

const iframePageQuery = gql`
  query iframePage($articleId: String!, $taxonomyId: String!, $transformArgs: TransformedArticleContentInput) {
    article(id: $articleId) {
      ...IframeArticlePage_Article
    }
    nodeByArticleId(nodeId: $taxonomyId, articleId: $articleId) {
      ...IframeArticlePage_Node
    }
  }
  ${iframeArticlePageFragments.node}
  ${iframeArticlePageFragments.article}
`;

export const IframePage = ({ taxonomyId, articleId, isOembed }: Props) => {
  const location = useLocation();
  const redirectContext = useContext(RedirectContext);
  const { loading, data, error } = useQuery<GQLIframePageQuery, GQLIframePageQueryVariables>(iframePageQuery, {
    variables: {
      articleId: articleId!,
      taxonomyId: taxonomyId || "",
      transformArgs: {
        showVisualElement: "true",
        path: location.pathname,
        isOembed,
      },
    },
    skip: !articleId,
  });

  if (!articleId) {
    return <Error />;
  }

  if (loading) {
    return null;
  }

  if (isGoneError(error) && redirectContext) {
    redirectContext.status = 410;
  }

  const { article, nodeByArticleId } = data ?? {};
  // Only care if article can be rendered
  if (!article) {
    return <NotFoundPage />;
  }
  return <IframeArticlePage node={nodeByArticleId} article={article} />;
};
