/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, Location } from "react-router-dom";
import { gql } from "@apollo/client";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import RedirectContext, { RedirectInfo } from "../../components/RedirectContext";
import ResponseContext from "../../components/ResponseContext";
import { RELEVANCE_SUPPLEMENTARY, SKIP_TO_CONTENT_ID } from "../../constants";
import {
  GQLContextQuery,
  GQLContextQueryVariables,
  GQLResourcePageQuery,
  GQLTaxonomyContext,
} from "../../graphqlTypes";
import { contextQuery } from "../../queries";
import { useUrnIds } from "../../routeHelpers";
import { findAccessDeniedErrors } from "../../util/handleError";
import { useGraphQuery } from "../../util/runQueries";
import { AccessDeniedPage } from "../AccessDeniedPage/AccessDeniedPage";
import ArticlePage, { articlePageFragments } from "../ArticlePage/ArticlePage";
import LearningpathPage, { learningpathPageFragments } from "../LearningpathPage/LearningpathPage";
import MovedResourcePage from "../MovedResourcePage/MovedResourcePage";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import { isLearningPathResource } from "../Resources/resourceHelpers";
import { UnpublishedResourcePage } from "../UnpublishedResourcePage/UnpublishedResourcePage";

const urlInContexts = (location: Location, contexts: Pick<GQLTaxonomyContext, "path" | "url">[]) => {
  const pathname = decodeURIComponent(location.pathname);
  return contexts?.find((c) => {
    return pathname.includes(c.path) || pathname.includes(c.url);
  });
};

const resourcePageQuery = gql`
  query resourcePage(
    $topicId: String!
    $subjectId: String!
    $resourceId: String!
    $transformArgs: TransformedArticleContentInput
  ) {
    subject: node(id: $subjectId) {
      ...LearningpathPage_Root
      ...ArticlePage_Root
    }
    resourceTypes {
      ...ArticlePage_ResourceType
      ...LearningpathPage_ResourceTypeDefinition
    }
    topic: node(id: $topicId, rootId: $subjectId) {
      ...LearningpathPage_Parent
      ...ArticlePage_Parent
    }
    resource: node(id: $resourceId, rootId: $subjectId, parentId: $topicId) {
      relevanceId
      paths
      breadcrumbs
      context {
        contextId
        breadcrumbs
        parentIds
        path
        url
        parents {
          contextId
          id
          name
          path
          url
        }
      }
      contexts {
        contextId
        path
        url
      }
      ...MovedResourcePage_Resource
      ...ArticlePage_Node
      ...LearningpathPage_Node
    }
  }
  ${articlePageFragments.parent}
  ${MovedResourcePage.fragments.resource}
  ${articlePageFragments.resource}
  ${articlePageFragments.resourceType}
  ${articlePageFragments.root}
  ${learningpathPageFragments.parent}
  ${learningpathPageFragments.resourceType}
  ${learningpathPageFragments.resource}
  ${learningpathPageFragments.root}
`;
const ResourcePage = () => {
  const { t } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const location = useLocation();
  const { contextId, subjectId: subId, resourceId: rId, topicId: tId, stepId } = useUrnIds();
  const { data: rootData, loading: rootLoading } = useGraphQuery<GQLContextQuery, GQLContextQueryVariables>(
    contextQuery,
    {
      variables: {
        contextId: contextId ?? "",
      },
      skip: contextId === undefined,
    },
  );
  const node = rootData?.node;
  const subjectId = node?.context?.rootId || subId;
  const resourceId = node?.id || rId;
  const topicId = node?.context?.parentIds?.slice(-1)?.[0] || tId;

  const { error, loading, data } = useGraphQuery<GQLResourcePageQuery>(resourcePageQuery, {
    variables: {
      subjectId,
      topicId,
      resourceId,
      transformArgs: {
        subjectId,
        prettyUrl: enablePrettyUrls,
      },
    },
    skip: rootLoading,
  });
  const redirectContext = useContext<RedirectInfo | undefined>(RedirectContext);
  const responseContext = useContext(ResponseContext);

  const topicPath = useMemo(() => {
    if (!data?.resource?.path) return [];
    return data.resource.context?.parents ?? [];
  }, [data?.resource]);

  if (loading || rootLoading) {
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

  if (error?.graphQLErrors.some((err) => err.extensions.status === 410) && redirectContext) {
    redirectContext.status = 410;
    return <UnpublishedResourcePage />;
  }

  if (responseContext?.status === 410) {
    return <UnpublishedResourcePage />;
  }

  if (!data) {
    return <DefaultErrorMessagePage />;
  }

  if (!data.resource || !data.resource.path) {
    return <NotFoundPage />;
  }

  if (data.resource && !urlInContexts(location, data.resource.contexts)) {
    if (data.resource.paths?.length === 1) {
      if (typeof window === "undefined") {
        if (redirectContext) {
          redirectContext.status = 301;
          redirectContext.url = data.resource.paths[0]!;
          return null;
        }
      } else {
        return <Navigate to={data.resource.paths[0]!} replace />;
      }
    } else {
      return <MovedResourcePage resource={data.resource} />;
    }
  }

  const { resource } = data;
  const relevanceId = resource.relevanceId;
  const relevance =
    relevanceId === RELEVANCE_SUPPLEMENTARY
      ? t("searchPage.searchFilterMessages.supplementaryRelevance")
      : t("searchPage.searchFilterMessages.coreRelevance");

  if (isLearningPathResource(resource)) {
    return (
      <LearningpathPage
        skipToContentId={SKIP_TO_CONTENT_ID}
        stepId={stepId}
        data={{ ...data, relevance, topicPath }}
        loading={loading}
      />
    );
  }
  return (
    <ArticlePage
      skipToContentId={SKIP_TO_CONTENT_ID}
      resource={data.resource}
      topic={data.topic}
      topicPath={topicPath}
      relevance={relevance}
      subject={data.subject}
      resourceTypes={data.resourceTypes}
      errors={error?.graphQLErrors}
      loading={loading}
    />
  );
};

export default ResourcePage;
