/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, Location } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import RedirectContext, { RedirectInfo } from "../../components/RedirectContext";
import ResponseContext from "../../components/ResponseContext";
import { RELEVANCE_SUPPLEMENTARY, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLResourcePageQuery, GQLTaxonomyContext } from "../../graphqlTypes";
import { useUrnIds } from "../../routeHelpers";
import { findAccessDeniedErrors } from "../../util/handleError";
import { isValidContextId } from "../../util/urlHelper";
import { AccessDeniedPage } from "../AccessDeniedPage/AccessDeniedPage";
import ArticlePage from "../ArticlePage/ArticlePage";
import LearningpathPage from "../LearningpathPage/LearningpathPage";
import MovedResourcePage from "../MovedResourcePage/MovedResourcePage";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import { isLearningPathResource } from "../Resources/resourceHelpers";
import { UnpublishedResourcePage } from "../UnpublishedResourcePage/UnpublishedResourcePage";

const urlInContexts = (location: Location, contexts: Pick<GQLTaxonomyContext, "url">[]) => {
  const pathname = decodeURIComponent(location.pathname);
  return contexts?.find((c) => {
    return pathname.includes(c.url);
  });
};

const contextIdInContexts = (contexts: Pick<GQLTaxonomyContext, "contextId">[], contextId?: string) => {
  return contexts?.find((c) => c.contextId === contextId);
};

const resourcePageQuery = gql`
  query resourcePage(
    $topicId: String
    $subjectId: String
    $resourceId: String
    $contextId: String
    $transformArgs: TransformedArticleContentInput
  ) {
    resourceTypes {
      ...ArticlePage_ResourceType
    }
    node(id: $resourceId, rootId: $subjectId, parentId: $topicId, contextId: $contextId) {
      relevanceId
      breadcrumbs
      context {
        contextId
        url
      }
      contexts {
        contextId
        url
      }
      ...MovedResourcePage_Node
      ...ArticlePage_Node
      ...LearningpathPage_Node
    }
  }
  ${MovedResourcePage.fragments.resource}
  ${ArticlePage.fragments.resource}
  ${ArticlePage.fragments.resourceType}
  ${LearningpathPage.fragments.resource}
`;
const ResourcePage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { contextId, subjectId, resourceId, topicId, stepId } = useUrnIds();

  const { error, loading, data } = useQuery<GQLResourcePageQuery>(resourcePageQuery, {
    variables: {
      subjectId,
      topicId,
      resourceId,
      contextId,
      transformArgs: {
        subjectId,
        prettyUrl: true,
      },
    },
    skip: !!contextId && !isValidContextId(contextId),
  });
  const redirectContext = useContext<RedirectInfo | undefined>(RedirectContext);
  const responseContext = useContext(ResponseContext);

  if (loading) {
    return <ContentPlaceholder variant="article" />;
  }

  const accessDeniedErrors = findAccessDeniedErrors(error);
  if (accessDeniedErrors) {
    const nonRecoverableError = accessDeniedErrors.some(
      (e) => !e.path?.includes("coreResources") && !e.path?.includes("supplementaryResources"),
    );

    if (nonRecoverableError) {
      return <AccessDeniedPage />;
    }
  }

  if (error?.graphQLErrors.some((err) => err.extensions?.status === 410) && redirectContext) {
    redirectContext.status = 410;
    return <UnpublishedResourcePage />;
  }

  if (responseContext?.status === 410) {
    return <UnpublishedResourcePage />;
  }

  if (!data) {
    return <DefaultErrorMessagePage />;
  }

  if (!data.node || !data.node.url) {
    return <NotFoundPage />;
  }

  if (
    data.node &&
    (contextId ? !contextIdInContexts(data.node.contexts, contextId) : !urlInContexts(location, data.node.contexts))
  ) {
    if (data.node.contexts?.length === 1) {
      if (typeof window === "undefined") {
        if (redirectContext) {
          redirectContext.status = 301;
          redirectContext.url = data.node.contexts[0]?.url ?? "";
          return null;
        }
      } else {
        return <Navigate to={data.node.contexts[0]?.url ?? ""} replace />;
      }
    } else {
      return <MovedResourcePage resource={data.node} />;
    }
  }

  const { node } = data;
  const relevanceId = node.relevanceId;
  const relevance =
    relevanceId === RELEVANCE_SUPPLEMENTARY
      ? t("searchPage.searchFilterMessages.supplementaryRelevance")
      : t("searchPage.searchFilterMessages.coreRelevance");

  if (isLearningPathResource(node)) {
    return (
      <LearningpathPage
        skipToContentId={SKIP_TO_CONTENT_ID}
        stepId={stepId}
        data={{ ...data, relevance }}
        loading={loading}
      />
    );
  }
  return (
    <ArticlePage
      skipToContentId={SKIP_TO_CONTENT_ID}
      resource={data.node}
      relevance={relevance}
      errors={error?.graphQLErrors}
      loading={loading}
    />
  );
};

export default ResourcePage;
