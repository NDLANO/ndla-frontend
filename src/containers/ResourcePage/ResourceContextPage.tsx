/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { ContentPlaceholder } from "@ndla/ui";
import Article from "../../components/Article";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import Learningpath from "../../components/Learningpath";
import RedirectContext, { RedirectInfo } from "../../components/RedirectContext";
import ResponseContext from "../../components/ResponseContext";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLResourceContextPageQuery } from "../../graphqlTypes";
import { useUrnIds } from "../../routeHelpers";
import { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { isAccessDeniedError } from "../../util/handleError";
import { useGraphQuery } from "../../util/runQueries";
import AccessDeniedPage from "../AccessDeniedPage/AccessDeniedPage";
import ArticlePage, { articlePageFragments } from "../ArticlePage/ArticlePage";
import LearningpathPage, {
  learningpathPageFragments,
  learningpathFragment,
} from "../LearningpathPage/LearningpathPage";
//import MovedResourcePage from "../MovedResourcePage/MovedResourcePage";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { isLearningPathResource } from "../Resources/resourceHelpers";
import UnpublishedResource from "../UnpublishedResourcePage/UnpublishedResourcePage";

const contextFragment = gql`
  fragment ContextPage_Context on TaxonomyContext {
    contextId
    breadcrumbs
    parentIds
    path
    relevance
    crumbs {
      contextId
      id
      name
      path
      url
    }
  }
`;

const resourceContextPageQuery = gql`
  query resourceContextPage($contextId: String!, $subjectId: String, $transformArgs: TransformedArticleContentInput) {
    resourceTypes {
      ...ArticlePage_ResourceType
      ...LearningpathPage_ResourceTypeDefinition
    }
    node(contextId: $contextId) {
      id
      name
      path
      contentUri
      relevanceId
      paths
      url
      contextId
      resourceTypes {
        id
        name
      }
      context {
        ...ContextPage_Context
      }
      contexts {
        ...ContextPage_Context
      }
      article {
        created
        updated
        metaDescription
        oembed
        tags
        ...StructuredArticleData
        ...Article_Article
      }
      learningpath {
        ...LearningpathPage_Learningpath
      }
      ...LearningpathPage_Subject
      ...ArticlePage_Subject
    }
  }
  ${contextFragment}
  ${Article.fragments.article}
  ${Learningpath.fragments.learningpathStep}
  ${Learningpath.fragments.learningpath}
  ${structuredArticleDataFragment}
  ${articlePageFragments.resourceType}
  ${articlePageFragments.subject}
  ${learningpathPageFragments.resourceType}
  ${learningpathPageFragments.subject}
  ${learningpathFragment}
`;

const ResourceContextPage = () => {
  const { t } = useTranslation();
  const { contextId, stepId } = useUrnIds();
  // const location = useLocation();
  const { error, loading, data } = useGraphQuery<GQLResourceContextPageQuery>(resourceContextPageQuery, {
    variables: {
      contextId,
    },
  });
  const redirectContext = useContext<RedirectInfo | undefined>(RedirectContext);
  const responseContext = useContext(ResponseContext);

  const topicPath = useMemo(() => {
    if (!data?.node?.url) return [];
    return data?.node.context?.crumbs ?? [];
  }, [data?.node?.context, data?.node?.url]);

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (isAccessDeniedError(error)) {
    return <AccessDeniedPage />;
  }

  if (error?.graphQLErrors.some((err) => err.extensions.status === 410) && redirectContext) {
    redirectContext.status = 410;
    return <UnpublishedResource />;
  }

  if (responseContext?.status === 410) {
    return <UnpublishedResource />;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  if (!data.node || !data.node.url) {
    return <NotFoundPage />;
  }

  /*if (data.node && !urlInPaths(location, data.node)) {
    if (data.node.paths?.length === 1) {
      if (typeof window === "undefined") {
        if (redirectContext) {
          redirectContext.status = 301;
          redirectContext.url = data.node.paths[0]!;
          return null;
        }
      } else {
        return <Navigate to={data.node.paths[0]!} replace />;
      }
    } else {
      return <MovedResourcePage resource={data.taxonomyEntity} />;
    }
    }*/

  const { node } = data;
  const relevance = node.context?.relevance ?? t("searchPage.searchFilterMessages.coreRelevance");

  if (isLearningPathResource(node)) {
    return (
      <LearningpathPage
        skipToContentId={SKIP_TO_CONTENT_ID}
        stepId={stepId}
        data={{
          ...data,
          resource: node,
          relevance,
          topicPath,
        }}
        loading={loading}
      />
    );
  }
  return (
    <ArticlePage
      skipToContentId={SKIP_TO_CONTENT_ID}
      resource={node}
      subjectId={data.node.context?.parentIds?.[0]}
      topicId={data.node.context?.parentIds?.slice(-1)?.[0]}
      topicPath={topicPath}
      relevance={relevance}
      resourceTypes={data.resourceTypes}
      errors={error?.graphQLErrors}
      loading={loading}
    />
  );
};

export default ResourceContextPage;
