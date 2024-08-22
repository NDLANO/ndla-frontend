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
import { SimpleBreadcrumbItem } from "@ndla/ui";
import SubjectTopic, { topicFragments } from "./SubjectTopic";
import DefaultErrorMessage from "../../../components/DefaultErrorMessage";
import { PageSpinner } from "../../../components/PageSpinner";
import { useEnablePrettyUrls } from "../../../components/PrettyUrlsContext";
import { GQLTaxBase, GQLTopicWrapperQuery, GQLTopicWrapperQueryVariables } from "../../../graphqlTypes";
import handleError, { isAccessDeniedError, isNotFoundError } from "../../../util/handleError";
import { useGraphQuery } from "../../../util/runQueries";

type Props = {
  topicId: string;
  subjectId?: string;
  subTopicId?: string;
  setBreadCrumb: Dispatch<SetStateAction<SimpleBreadcrumbItem[]>>;
  showResources: boolean;
  subject?: GQLTaxBase;
};

const topicWrapperQuery = gql`
  query topicWrapper($topicId: String!, $subjectId: String, $transformArgs: TransformedArticleContentInput) {
    topic: node(id: $topicId, rootId: $subjectId) {
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
  const enablePrettyUrls = useEnablePrettyUrls();
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
          const topicPath = topic.context?.crumbs ?? [];
          const newCrumbs = topicPath
            .map((tp) => ({
              to: enablePrettyUrls ? tp.url : tp.path,
              name: tp.name,
            }))
            .slice(1);
          setBreadCrumb(
            newCrumbs.concat({ to: enablePrettyUrls ? topic.url ?? topic.path : topic.path, name: topic.name }),
          );
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
    return <PageSpinner />;
  }

  return (
    <SubjectTopic
      topic={data.topic}
      resourceTypes={data.resourceTypes}
      topicId={topicId}
      subTopicId={subTopicId}
      showResources={showResources}
      subject={subject}
      loading={loading}
    />
  );
};

export default TopicWrapper;
