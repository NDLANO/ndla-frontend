/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { Spinner } from "@ndla/icons";
import { SimpleBreadcrumbItem } from "@ndla/ui";
import Topic, { topicFragments } from "./Topic";
import {
  GQLTopicWrapperQuery,
  GQLTopicWrapperQueryVariables,
  GQLTopicWrapper_SubjectFragment,
} from "../../../graphqlTypes";
import { removeUrn } from "../../../routeHelpers";
import { getTopicPathV2 } from "../../../util/getTopicPath";
import handleError, { isAccessDeniedError } from "../../../util/handleError";
import { useGraphQuery } from "../../../util/runQueries";

type Props = {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  setBreadCrumb: Dispatch<SetStateAction<SimpleBreadcrumbItem[]>>;
  showResources: boolean;
  subject: GQLTopicWrapper_SubjectFragment;
};

const topicWrapperQuery = gql`
  query topicWrapper($topicId: String!, $subjectId: String, $convertEmbeds: Boolean) {
    topic(id: $topicId, subjectId: $subjectId) {
      id
      ...Topic_Topic
    }
    resourceTypes {
      ...Topic_ResourceTypeDefinition
    }
  }
  ${topicFragments.topic}
  ${topicFragments.resourceType}
`;

const TopicWrapper = ({ subTopicId, topicId, subjectId, setBreadCrumb, showResources, subject }: Props) => {
  const navigate = useNavigate();
  const { data, loading, error } = useGraphQuery<GQLTopicWrapperQuery, GQLTopicWrapperQueryVariables>(
    topicWrapperQuery,
    {
      variables: {
        topicId,
        subjectId,
        convertEmbeds: true,
      },
      onCompleted: (data) => {
        const topic = data.topic;
        if (topic) {
          const topicPath = getTopicPathV2(topic.path, topic.contexts);
          const newCrumbs = topicPath
            .map((tp) => ({
              to: `/${removeUrn(tp.id)}`,
              name: tp.name,
            }))
            .slice(1);
          setBreadCrumb(newCrumbs.concat({ to: topic.id, name: topic.name }));
        }
      },
    },
  );

  if (error) {
    handleError(error);
    if (isAccessDeniedError(error)) {
      navigate("/403", { replace: true });
    } else {
      navigate("/404", { replace: true });
    }
  }

  if (loading || !data?.topic?.article) {
    return <Spinner />;
  }

  return (
    <Topic
      topic={data.topic}
      resourceTypes={data.resourceTypes}
      topicId={topicId}
      subjectId={subjectId}
      subTopicId={subTopicId}
      showResources={showResources}
      subject={subject}
      loading={loading}
    />
  );
};

TopicWrapper.fragments = {
  subject: gql`
    fragment TopicWrapper_Subject on Subject {
      ...Topic_Subject
    }
    ${topicFragments.subject}
  `,
};
export default TopicWrapper;
