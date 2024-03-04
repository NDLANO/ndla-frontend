/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useGraphQuery } from "../../util/runQueries";
import ArticlePage, { articlePageFragments } from "../ArticlePage/ArticlePage";
import LearningpathPage, { learningpathPageFragments } from "../LearningpathPage/LearningpathPage";
import MovedResourcePage from "../MovedResourcePage/MovedResourcePage";

const contextResourcePageQuery = gql`
  query contextResourcePage($path: String!) {
    resourceByPath(path: $path) {
      relevanceId
      paths
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
  ${articlePageFragments.topicPath}
  ${learningpathPageFragments.topic}
  ${learningpathPageFragments.resourceType}
  ${learningpathPageFragments.resource}
  ${learningpathPageFragments.subject}
  ${learningpathPageFragments.topicPath}
`;

export const ContextResourcePage = () => {
  const { data } = useGraphQuery(contextResourcePageQuery, {
    variables: {
      path: "/how-to-make-a-good-presentation__3282c6cceeff",
    },
  });
  return <pre>{JSON.stringify(data)}</pre>;
};
