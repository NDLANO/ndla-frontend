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
import { ContentPlaceholder } from "@ndla/ui";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import RedirectContext, { RedirectInfo } from "../../components/RedirectContext";
import { RELEVANCE_SUPPLEMENTARY, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLResource, GQLResourcePageQuery } from "../../graphqlTypes";
import { useUrnIds } from "../../routeHelpers";
import { isAccessDeniedError } from "../../util/handleError";
import { useGraphQuery } from "../../util/runQueries";
import AccessDeniedPage from "../AccessDeniedPage/AccessDeniedPage";
import ArticlePage, { articlePageFragments } from "../ArticlePage/ArticlePage";
import LearningpathPage, { learningpathPageFragments } from "../LearningpathPage/LearningpathPage";
import MovedResourcePage from "../MovedResourcePage/MovedResourcePage";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { isLearningPathResource } from "../Resources/resourceHelpers";

const urlInPaths = (location: Location, resource: Pick<GQLResource, "paths">) => {
  return resource.paths?.find((p) => location.pathname.includes(p));
};

const resourcePageQuery = gql`
  query resourcePage(
    $topicId: String!
    $subjectId: String!
    $resourceId: String!
    $transformArgs: TransformedArticleContentInput
  ) {
    subject(id: $subjectId) {
      ...LearningpathPage_Subject
      ...ArticlePage_Subject
    }
    resourceTypes {
      ...ArticlePage_ResourceType
      ...LearningpathPage_ResourceTypeDefinition
    }
    topic(id: $topicId, subjectId: $subjectId) {
      ...LearningpathPage_Topic
      ...ArticlePage_Topic
    }
    resource(id: $resourceId, subjectId: $subjectId, topicId: $topicId) {
      relevanceId
      paths
      contextId
      contexts {
        contextId
        breadcrumbs
        parentIds
        path
        crumbs {
          contextId
          id
          name
          path
          url
        }
      }
      ...MovedResourcePage_Resource
      ...ArticlePage_Resource
      ...LearningpathPage_Resource
    }
  }
  ${articlePageFragments.topic}
  ${MovedResourcePage.fragments.resource}
  ${articlePageFragments.resource}
  ${articlePageFragments.resourceType}
  ${articlePageFragments.subject}
  ${learningpathPageFragments.topic}
  ${learningpathPageFragments.resourceType}
  ${learningpathPageFragments.resource}
  ${learningpathPageFragments.subject}
`;
const ResourcePage = () => {
  const { t } = useTranslation();
  const { subjectId, resourceId, topicId, stepId } = useUrnIds();
  const location = useLocation();
  const { error, loading, data } = useGraphQuery<GQLResourcePageQuery>(resourcePageQuery, {
    variables: {
      subjectId,
      topicId,
      resourceId,
      transformArgs: {
        subjectId,
      },
    },
  });
  const redirectContext = useContext<RedirectInfo | undefined>(RedirectContext);

  const topicPath = useMemo(() => {
    if (!data?.resource?.path) return [];
    return data?.resource.contexts.find((context) => context.contextId === data?.resource?.contextId)?.crumbs ?? [];
  }, [data?.resource?.contextId, data?.resource?.contexts, data?.resource?.path]);

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (isAccessDeniedError(error)) {
    return <AccessDeniedPage />;
  }

  if (error?.graphQLErrors.some((err) => err.extensions.status === 410) && redirectContext) {
    redirectContext.status = 410;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  if (!data.resource || !data.resource.path) {
    return <NotFoundPage />;
  }

  if (data.resource && !urlInPaths(location, data.resource)) {
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
