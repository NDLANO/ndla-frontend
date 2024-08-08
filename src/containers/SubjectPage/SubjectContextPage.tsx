/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef } from "react";
import { gql } from "@apollo/client";
import { ContentPlaceholder } from "@ndla/ui";
import SubjectContextContainer, { subjectContextContainerFragments } from "./SubjectContextContainer";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import { GQLContextPageQuery, GQLContextPageQueryVariables } from "../../graphqlTypes";
import { useUrnIds } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

export const nodeFragment = gql`
  fragment NodeFragment on Node {
    id
    name
    path
    url
    context {
      contextId
      rootId
      crumbs {
        id
        name
        url
        path
      }
    }
  }
`;

const contextPageQuery = gql`
  query contextPage(
    $subjectContextId: String!
    $includeSubject: Boolean!
    $topicContextId: String!
    $includeTopic: Boolean!
  ) {
    subject: node(contextId: $subjectContextId) @include(if: $includeSubject) {
      ...NodeFragment
      ...SubjectContextContainer_Subject
    }
    topic: node(contextId: $topicContextId) @include(if: $includeTopic) {
      ...NodeFragment
    }
  }
  ${nodeFragment}
  ${subjectContextContainerFragments.subject}
`;

const SubjectContextPage = () => {
  const { subjectContextId, topicContextId } = useUrnIds();

  const initialLoad = useRef(true);

  const {
    loading,
    data: newData,
    previousData,
  } = useGraphQuery<GQLContextPageQuery, GQLContextPageQueryVariables>(contextPageQuery, {
    variables: {
      subjectContextId: subjectContextId ?? "",
      includeSubject: subjectContextId !== undefined,
      topicContextId: topicContextId ?? "",
      includeTopic: topicContextId !== undefined,
    },
  });

  const data = newData ?? previousData;

  if (!data && !loading) {
    return <DefaultErrorMessage />;
  }

  if (!data) {
    return <ContentPlaceholder />;
  }

  if (!data.subject && !data.topic) {
    return <NotFoundPage />;
  }

  initialLoad.current = false;

  const topicList = (
    (data.topic?.context?.crumbs && data.topic?.context?.crumbs?.slice(1).map((crumb) => crumb.id)) ??
    []
  ).concat(data.topic?.id ? [data.topic.id] : []);
  return (
    <SubjectContextContainer
      subjectFragment={data.subject}
      subjectId={data.subject?.id}
      topicFragment={data.topic}
      topicId={data.topic?.id}
      topicIds={topicList}
      loading={loading}
    />
  );
};

export default SubjectContextPage;
