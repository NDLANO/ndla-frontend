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
import LearningpathPage, { learningpathPageFragments } from "../LearningpathPage/LearningpathPage";
//import MovedResourcePage from "../MovedResourcePage/MovedResourcePage";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { isLearningPathResource } from "../Resources/resourceHelpers";
import UnpublishedResource from "../UnpublishedResourcePage/UnpublishedResourcePage";

const resourceContextPageQuery = gql`
  query resourceContextPage($contextId: String!, $subjectId: String, $transformArgs: TransformedArticleContentInput) {
    resourceTypes {
      ...ArticlePage_ResourceType
      ...LearningpathPage_ResourceTypeDefinition
    }
    taxonomyEntity(contextId: $contextId) {
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
      contexts {
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
        supportedLanguages
        tags
        description
        coverphoto {
          url
          metaUrl
        }
        learningsteps {
          type
          ...Learningpath_LearningpathStep
        }
        ...Learningpath_Learningpath
      }
    }
  }
  ${Article.fragments.article}
  ${Learningpath.fragments.learningpathStep}
  ${Learningpath.fragments.learningpath}
  ${structuredArticleDataFragment}
  ${articlePageFragments.resourceType}
  ${learningpathPageFragments.resourceType}
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
    if (!data?.taxonomyEntity?.url) return [];
    return (
      data?.taxonomyEntity.contexts.find((context) => context.contextId === data?.taxonomyEntity?.contextId)?.crumbs ??
      []
    );
  }, [data?.taxonomyEntity?.contextId, data?.taxonomyEntity?.contexts, data?.taxonomyEntity?.url]);

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

  if (!data.taxonomyEntity || !data.taxonomyEntity.url) {
    return <NotFoundPage />;
  }

  /*if (data.taxonomyEntity && !urlInPaths(location, data.taxonomyEntity)) {
    if (data.taxonomyEntity.paths?.length === 1) {
      if (typeof window === "undefined") {
        if (redirectContext) {
          redirectContext.status = 301;
          redirectContext.url = data.taxonomyEntity.paths[0]!;
          return null;
        }
      } else {
        return <Navigate to={data.taxonomyEntity.paths[0]!} replace />;
      }
    } else {
      return <MovedResourcePage resource={data.taxonomyEntity} />;
    }
    }*/

  const { taxonomyEntity } = data;
  const relevance =
    taxonomyEntity.contexts.find((c) => c.contextId === contextId)?.relevance ??
    t("searchPage.searchFilterMessages.coreRelevance");

  if (isLearningPathResource(taxonomyEntity)) {
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
      resource={taxonomyEntity}
      //topic={data.topic}
      topicPath={topicPath}
      relevance={relevance}
      subject={{ id: data.taxonomyEntity.id, name: data.taxonomyEntity.name, metadata: { customFields: [] } }}
      resourceTypes={data.resourceTypes}
      errors={error?.graphQLErrors}
      loading={loading}
    />
  );
};

export default ResourceContextPage;
