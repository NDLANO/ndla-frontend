/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, Location, useParams } from "react-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { RedirectContext, RedirectInfo } from "../../components/RedirectContext";
import { RedirectExternal } from "../../components/RedirectExternal";
import { ResponseContext } from "../../components/ResponseContext";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLResourcePageQuery, GQLTaxonomyContext } from "../../graphqlTypes";
import { findAccessDeniedErrors, isGoneError, isNotFoundError } from "../../util/handleError";
import { constructNewPath, isValidContextId } from "../../util/urlHelper";
import { AccessDeniedPage } from "../AccessDeniedPage/AccessDeniedPage";
import { ArticlePage } from "../ArticlePage/ArticlePage";
import { LearningpathPage } from "../LearningpathPage/LearningpathPage";
import { MovedResourcePage } from "../MovedResourcePage/MovedResourcePage";
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
  query resourcePage($contextId: String, $transformArgs: TransformedArticleContentInput) {
    node(contextId: $contextId) {
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
      supportedLanguages
      ...MovedResourcePage_Node
      ...ArticlePage_Node
      ...LearningpathPage_Node
    }
  }
  ${MovedResourcePage.fragments.resource}
  ${ArticlePage.fragments.resource}
  ${LearningpathPage.fragments.resource}
`;
export const ResourcePage = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { contextId, stepId } = useParams();

  const { error, loading, data } = useQuery<GQLResourcePageQuery>(resourcePageQuery, {
    variables: {
      contextId,
      transformArgs: {
        contextId,
      },
    },
    skip: !isValidContextId(contextId),
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

  if (responseContext?.status === 410) {
    return <UnpublishedResourcePage />;
  }

  if (error) {
    if (isGoneError(error) && redirectContext) {
      redirectContext.status = 410;
      return <UnpublishedResourcePage />;
    }
    if (isNotFoundError(error)) {
      return <NotFoundPage />;
    }
    return <DefaultErrorMessagePage />;
  }

  if (!data || !data.node || !data.node.url) {
    return <NotFoundPage />;
  }

  if (i18n.language === "se" && !data.node.supportedLanguages?.includes("se")) {
    return <RedirectExternal to={constructNewPath(location.pathname, "nb")} />;
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

  if (isLearningPathResource(data.node.contentUri)) {
    return (
      <LearningpathPage
        key={data.node.url}
        skipToContentId={SKIP_TO_CONTENT_ID}
        stepId={stepId}
        node={data.node}
        loading={loading}
      />
    );
  }
  return (
    <ArticlePage key={data.node.url} skipToContentId={SKIP_TO_CONTENT_ID} resource={data.node} loading={loading} />
  );
};

export const Component = ResourcePage;
