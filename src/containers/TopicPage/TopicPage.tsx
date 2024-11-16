/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { MovedTopicPage } from "./MovedTopicPage";
import { TopicContainer } from "./TopicContainer";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { TransportationNode } from "../../components/TransportationPage/TransportationPageNode";
import { GQLTopicPageQuery, GQLTopicPageQueryVariables } from "../../graphqlTypes";
import { getSubjectType, useUrnIds } from "../../routeHelpers";
import handleError, { findAccessDeniedErrors, isNotFoundError } from "../../util/handleError";
import { useGraphQuery } from "../../util/runQueries";
import { ForbiddenPage } from "../ErrorPage/ForbiddenPage";
import MultidisciplinaryArticleList from "../MultidisciplinarySubject/components/MultidisciplinaryArticleList";
import MultidisciplinarySubjectArticlePage from "../MultidisciplinarySubject/MultidisciplinarySubjectArticlePage";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import Resources from "../Resources/Resources";

export const topicPageQuery = gql`
  query topicPage($id: String, $rootId: String, $contextId: String, $transformArgs: TransformedArticleContentInput) {
    node(id: $id, rootId: $rootId, contextId: $contextId) {
      id
      name
      supportedLanguages
      breadcrumbs
      relevanceId
      nodeType
      article {
        htmlTitle
        htmlIntroduction
        grepCodes
        metaImage {
          url
          alt
        }
        transformedContent(transformArgs: $transformArgs) {
          visualElementEmbed {
            content
          }
        }
      }
      alternateNodes {
        ...MovedTopicPage_Node
      }
      meta {
        metaDescription
        metaImage {
          url
          alt
        }
      }
      context {
        contextId
        rootId
        name
        path
        url
        isActive
        parents {
          id
          name
          path
          url
        }
      }
      ...Resources_Parent
      nodes: children(nodeType: "TOPIC") {
        id
        ...TransportationNode_Node
        ...MultidisciplinaryArticleList_Node
      }
    }
    resourceTypes {
      ...Resources_ResourceTypeDefinition
    }
  }
  ${TransportationNode.fragments.node}
  ${MovedTopicPage.fragments.node}
  ${MultidisciplinaryArticleList.fragments.node}
  ${Resources.fragments.node}
  ${Resources.fragments.resourceType}
`;

export const TopicPage = () => {
  const { contextId, subjectId, topicId } = useUrnIds();
  const query = useGraphQuery<GQLTopicPageQuery, GQLTopicPageQueryVariables>(topicPageQuery, {
    variables: {
      id: topicId,
      rootId: subjectId,
      contextId: contextId,
    },
  });

  if (query.loading) {
    return <ContentPlaceholder />;
  }

  if (query.data?.node?.alternateNodes?.length) {
    return <MovedTopicPage nodes={query.data.node.alternateNodes} />;
  }

  if (!query.data || query.error) {
    handleError(query.error);
    const accessDeniedErrors = findAccessDeniedErrors(query.error);
    if (accessDeniedErrors.length) {
      const nonRecoverableError = accessDeniedErrors.some(
        (e) => !e.path?.includes("resources") && !e.path?.includes("children"),
      );

      if (nonRecoverableError) {
        return <ForbiddenPage />;
      }
    } else if (isNotFoundError(query.error)) {
      return <NotFoundPage />;
    } else return <DefaultErrorMessagePage />;
  }

  if (!query.data?.node) {
    return <DefaultErrorMessagePage />;
  }

  const { node } = query.data;
  if (node.nodeType !== "TOPIC") {
    return <DefaultErrorMessagePage />;
  }
  const parents = node.context?.parents || [];
  const subjectType = getSubjectType(node.context?.rootId);

  if (subjectType === "multiDisciplinary" && parents.length === 3) {
    return <MultidisciplinarySubjectArticlePage subjectId={node.context?.rootId} topicId={node.id} />;
  }

  return <TopicContainer node={query.data.node} resourceTypes={query.data.resourceTypes} subjectType={subjectType} />;
};
