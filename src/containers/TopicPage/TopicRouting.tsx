/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Navigate } from "react-router-dom";
import { TopicPage } from "./TopicPage";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { GQLContextQuery, GQLContextQueryVariables } from "../../graphqlTypes";
import { contextQuery } from "../../queries";
import { getSubjectType, useUrnIds } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import MultidisciplinarySubjectArticlePage from "../MultidisciplinarySubject/MultidisciplinarySubjectArticlePage";

export const TopicRouting = () => {
  const { contextId, subjectId: subId, topicId: tId, topicList } = useUrnIds();

  const { loading, data } = useGraphQuery<GQLContextQuery, GQLContextQueryVariables>(contextQuery, {
    variables: {
      contextId: contextId ?? "",
    },
    skip: contextId === undefined,
  });

  if (loading && !data) {
    return <ContentPlaceholder />;
  }

  const node = data?.node;
  const subjectId = node?.context?.rootId ?? subId ?? "";

  if (!subjectId) {
    return <Navigate to="/404" replace />;
  }

  const topicId = node?.nodeType === "TOPIC" ? node?.id : tId;
  const subjectType = getSubjectType(subjectId);

  if (subjectType === "multiDisciplinary" && topicList.length === 3) {
    return <MultidisciplinarySubjectArticlePage subjectId={subjectId} topicId={topicId} />;
  }

  return <TopicPage />;
};
