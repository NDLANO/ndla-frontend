/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useParams } from "react-router";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { RedirectContext, RedirectInfo } from "../../components/RedirectContext";
import { RedirectExternal } from "../../components/RedirectExternal";
import { ResponseContext } from "../../components/ResponseContext";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLResourcePageQuery, GQLResourcePageQueryVariables } from "../../graphqlTypes";
import { findAccessDeniedErrors, isGoneError, isNotFoundError } from "../../util/handleError";
import { constructNewPath, isValidContextId } from "../../util/urlHelper";
import { AccessDeniedPage } from "../AccessDeniedPage/AccessDeniedPage";
import { ArticleLayout } from "../ArticlePage/ArticleLayout";
import { ArticlePage } from "../ArticlePage/ArticlePage";
import { LearningpathPage } from "../LearningpathPage/LearningpathPage";
import { MovedResourcePage } from "../MovedResourcePage/MovedResourcePage";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import { UnpublishedResourcePage } from "../UnpublishedResourcePage/UnpublishedResourcePage";

const resourcePageQuery: TypedDocumentNode<GQLResourcePageQuery, GQLResourcePageQueryVariables> = gql`
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
  const decodedPathname = useMemo(() => decodeURIComponent(location.pathname), [location]);

  const { error, loading, data, previousData } = useQuery(resourcePageQuery, {
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

  if (!loading) {
    if (!data || !data.node || !data.node.url) {
      return <NotFoundPage />;
    }

    if (i18n.language === "se" && !data.node.supportedLanguages?.includes("se")) {
      return <RedirectExternal to={constructNewPath(location.pathname, "nb")} />;
    }

    if (
      data.node &&
      (contextId
        ? !data.node.contexts.some((c) => c.contextId === contextId)
        : !data.node.contexts.some((c) => decodedPathname.includes(c.url)))
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
  }

  if (data?.node?.learningpath?.id) {
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

  const ctx = data?.node?.context ?? previousData?.node?.context;

  return (
    <ArticleLayout
      parentId={ctx?.parents?.[ctx.parents.length - 1]?.id}
      rootId={ctx?.parents?.[0]?.id}
      rootLoading={loading}
    >
      <ArticlePage key={data?.node?.url} skipToContentId={SKIP_TO_CONTENT_ID} resource={data?.node} loading={loading} />
    </ArticleLayout>
  );
};

export const Component = ResourcePage;
