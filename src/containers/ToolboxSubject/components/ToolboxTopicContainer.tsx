/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction } from "react";
import { gql } from "@apollo/client";
import { Spinner } from "@ndla/primitives";
import { SimpleBreadcrumbItem } from "@ndla/ui";
import ToolboxTopicWrapper, { toolboxTopicWrapperFragments } from "./ToolboxTopicWrapper";
import DefaultErrorMessage from "../../../components/DefaultErrorMessage";
import {
  GQLTaxBase,
  GQLToolboxTopicContainerQuery,
  GQLToolboxTopicContainerQueryVariables,
} from "../../../graphqlTypes";
import { removeUrn } from "../../../routeHelpers";
import { useGraphQuery } from "../../../util/runQueries";

interface Props {
  subject: GQLTaxBase;
  topicId: string;
  topicList: Array<string>;
  setCrumbs: Dispatch<SetStateAction<SimpleBreadcrumbItem[]>>;
  index: number;
}

const toolboxTopicContainerQuery = gql`
  query toolboxTopicContainer($topicId: String!, $subjectId: String!, $transformArgs: TransformedArticleContentInput) {
    topic: node(id: $topicId, rootId: $subjectId) {
      id # This query recursively calls itself if ID is not included here. Not sure why.
      ...ToolboxTopicWrapper_Topic
    }
    resourceTypes {
      ...ToolboxTopicWrapper_ResourceTypeDefinition
    }
  }
  ${toolboxTopicWrapperFragments.resourceType}
  ${toolboxTopicWrapperFragments.topic}
`;

export const ToolboxTopicContainer = ({ subject, topicId, topicList, setCrumbs, index }: Props) => {
  const { loading, data } = useGraphQuery<GQLToolboxTopicContainerQuery, GQLToolboxTopicContainerQueryVariables>(
    toolboxTopicContainerQuery,
    {
      variables: {
        subjectId: subject.id,
        topicId,
        transformArgs: {
          subjectId: subject.id,
        },
      },
      onCompleted: (data) => {
        const topic = data.topic;
        if (topic) {
          setCrumbs((crumbs) =>
            crumbs.slice(0, index).concat({
              to: `/${removeUrn(topic.id)}`,
              name: topic.name,
            }),
          );
        }
      },
    },
  );

  if (loading) {
    return <Spinner />;
  }

  if (!data?.topic) {
    return <DefaultErrorMessage />;
  }

  return (
    <ToolboxTopicWrapper
      subject={subject}
      loading={loading}
      topic={data.topic}
      resourceTypes={data.resourceTypes}
      topicList={topicList}
      index={index}
    />
  );
};
