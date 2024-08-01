/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef } from "react";
import { useParams } from "react-router-dom";
import { gql } from "@apollo/client";
import { ContentPlaceholder } from "@ndla/ui";
import SubjectContextContainer, { subjectContextContainerFragments } from "./SubjectContextContainer";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import { GQLSubjectContextPageQuery, GQLSubjectContextPageQueryVariables } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const subjectContextPageQuery = gql`
  query subjectContextPage($contextId: String!) {
    subject: node(contextId: $contextId) {
      id
      name
      path
      url
      context {
        contextId
        crumbs {
          id
          name
          url
          path
        }
      }
      children(nodeType: TOPIC) {
        id
        name
        path
        url
        parentId
        context {
          contextId
          crumbs {
            id
            name
            url
            path
          }
        }
      }
      metadata {
        customFields
      }
      ...SubjectContextContainer_Node
    }
  }
  ${subjectContextContainerFragments.subject}
`;

const SubjectContextPage = () => {
  const params = useParams();

  const initialLoad = useRef(true);

  const {
    loading,
    data: newData,
    previousData,
  } = useGraphQuery<GQLSubjectContextPageQuery, GQLSubjectContextPageQueryVariables>(subjectContextPageQuery, {
    variables: {
      contextId: params.subjectContextId ?? "",
    },
  });

  const data = newData ?? previousData;

  if (!data && !loading) {
    return <DefaultErrorMessage />;
  }

  if (!data) {
    return <ContentPlaceholder />;
  }

  if (!data.subject) {
    return <NotFoundPage />;
  }

  initialLoad.current = false;

  const topicList =
    data.subject.children?.filter((child) => child.parentId === data.subject?.id).map((child) => child.id) ?? [];

  return <SubjectContextContainer topicIds={topicList} subject={data.subject} loading={loading} />;
};

export default SubjectContextPage;
