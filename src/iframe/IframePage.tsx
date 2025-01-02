/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { PageContent } from "@ndla/primitives";
import { ErrorMessage } from "@ndla/ui";
import IframeArticlePage, { iframeArticlePageFragments } from "./IframeArticlePage";
import { Status } from "../components";
import RedirectContext from "../components/RedirectContext";
import { NotFoundPage } from "../containers/NotFoundPage/NotFoundPage";
import { GQLIframePageQuery, GQLIframePageQueryVariables } from "../graphqlTypes";
import { INTERNAL_SERVER_ERROR } from "../statusCodes";
import "../style/index.css";

const Error = () => {
  const { t } = useTranslation();
  return (
    <Status code={INTERNAL_SERVER_ERROR}>
      <PageContent>
        <ErrorMessage
          illustration={{
            url: "/static/oops.gif",
            altText: t("errorMessage.title"),
          }}
          messages={{
            title: t("errorMessage.title"),
            description: t("errorMessage.description"),
          }}
        />
      </PageContent>
    </Status>
  );
};

interface Props {
  articleId?: string;
  taxonomyId?: string;
  status?: "success" | "error";
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

export const IframePage = ({ status, taxonomyId, articleId, isOembed }: Props) => {
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
        prettyUrl: true,
      },
    },
    skip: !articleId,
  });

  if (status !== "success" || !articleId) {
    return <Error />;
  }

  if (loading) {
    return null;
  }
  if (error?.graphQLErrors.some((err) => err.extensions?.status === 410) && redirectContext) {
    redirectContext.status = 410;
  }

  const { article, nodeByArticleId } = data ?? {};
  // Only care if article can be rendered
  if (!article) {
    return <NotFoundPage />;
  }
  return <IframeArticlePage node={nodeByArticleId} article={article} />;
};

export default IframePage;
