/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { MultidisciplinarySubjectArticle } from "./MultidisciplinarySubjectArticle";
import { TopicContainer } from "./TopicContainer";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { RedirectExternal } from "../../components/RedirectExternal";
import { MULTIDISCIPLINARY_SUBJECT_ID } from "../../constants";
import { GQLTopicPageQuery, GQLTopicPageQueryVariables } from "../../graphqlTypes";
import { getSubjectType } from "../../routeHelpers";
import { findAccessDeniedErrors, isNotFoundError } from "../../util/handleError";
import { constructNewPath, isValidContextId } from "../../util/urlHelper";
import { ForbiddenPage } from "../ErrorPage/ForbiddenPage";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

export const topicPageQuery = gql`
  query topicPage($rootId: String, $contextId: String, $transformArgs: TransformedArticleContentInput) {
    node(rootId: $rootId, contextId: $contextId) {
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
        url
        isArchived
        parents {
          id
          name
          url
        }
      }
      ...MultidisciplinarySubjectArticle_Node
      ...TopicContainer_Node
    }
  }
  ${MultidisciplinarySubjectArticle.fragments.node}
  ${TopicContainer.fragments.node}
`;

export const TopicPage = () => {
  const { contextId } = useParams();
  const location = useLocation();
  const { i18n } = useTranslation();
  const query = useQuery<GQLTopicPageQuery, GQLTopicPageQueryVariables>(topicPageQuery, {
    variables: {
      contextId: contextId,
      // TODO: Is it wise to hardcode this? Should it always be set? Multidisciplinary breaks if we don't have it.
      rootId: MULTIDISCIPLINARY_SUBJECT_ID,
      transformArgs: {
        showVisualElement: "true",
      },
    },
    skip: !isValidContextId(contextId),
  });

  if (query.loading) {
    return <ContentPlaceholder />;
  }

  if (query.error) {
    const accessDeniedErrors = findAccessDeniedErrors(query.error);
    if (accessDeniedErrors.length) {
      const nonRecoverableError = accessDeniedErrors.some(
        (e) => !e.path?.includes("resources") && !e.path?.includes("children"),
      );

      if (nonRecoverableError) return <ForbiddenPage />;
    }

    if (isNotFoundError(query.error)) return <NotFoundPage />;
  }

  if (!query.data?.node?.article) {
    return <NotFoundPage />;
  }

  const { node } = query.data;
  if (node.nodeType !== "TOPIC") {
    return <DefaultErrorMessagePage />;
  }
  if (i18n.language === "se" && !node.supportedLanguages?.includes("se")) {
    return <RedirectExternal to={constructNewPath(location.pathname, "nb")} />;
  }
  const parents = node.context?.parents || [];
  const subjectType = getSubjectType(node.context?.rootId);

  if (subjectType === "multiDisciplinary" && parents.length === 3) {
    return <MultidisciplinarySubjectArticle node={node} />;
  }

  return <TopicContainer node={node} subjectType={subjectType} />;
};

export const Component = TopicPage;
