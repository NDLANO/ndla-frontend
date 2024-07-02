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
import SubjectTopic, { topicFragments } from "./SubjectTopic";
import DefaultErrorMessage from "../../../components/DefaultErrorMessage";
import {
  GQLTopicWrapperQuery,
  GQLTopicWrapperQueryVariables,
  GQLTopicWrapper_SubjectFragment,
} from "../../../graphqlTypes";
import { removeUrn } from "../../../routeHelpers";
import handleError, { isAccessDeniedError, isNotFoundError } from "../../../util/handleError";
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
  query topicWrapper($topicId: String!, $subjectId: String, $transformArgs: TransformedArticleContentInput) {
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
        transformArgs: {
          subjectId,
        },
      },
      onCompleted: (data) => {
        const topic = data.topic;
        if (topic) {
          const topicPath = topic.contexts.find((context) => context.contextId === topic.contextId)?.crumbs ?? [];
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
    } else if (isNotFoundError(error)) {
      navigate("/404", { replace: true });
    } else return <DefaultErrorMessage />;
  }

  if (loading || !data?.topic?.article) {
    return <Spinner />;
  }

  return (
    <SubjectTopic
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
