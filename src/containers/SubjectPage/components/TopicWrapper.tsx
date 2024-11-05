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
import { DefaultErrorMessage } from "../../../components/DefaultErrorMessage";
import { PageSpinner } from "../../../components/PageSpinner";
import { useEnablePrettyUrls } from "../../../components/PrettyUrlsContext";
import {
  GQLTopicWrapperQuery,
  GQLTopicWrapperQueryVariables,
  GQLTopicWrapper_RootFragment,
} from "../../../graphqlTypes";
import handleError, { findAccessDeniedErrors, isNotFoundError } from "../../../util/handleError";
import { useGraphQuery } from "../../../util/runQueries";

type Props = {
  topicId: string;
  topicIds: string[];
  activeTopic: boolean;
  subjectId: string;
  subjectType?: string;
  subTopicId?: string;
  setBreadCrumb: Dispatch<SetStateAction<SimpleBreadcrumbItem[]>>;
  showResources: boolean;
  subject: GQLTopicWrapper_RootFragment;
};

const topicWrapperQuery = gql`
  query topicWrapper($topicId: String!, $subjectId: String, $transformArgs: TransformedArticleContentInput) {
    topic: node(id: $topicId, rootId: $subjectId) {
      id
      ...Topic_Parent
    }
    resourceTypes {
      ...Topic_ResourceTypeDefinition
    }
  }
  ${topicFragments.parent}
  ${topicFragments.resourceType}
`;

const TopicWrapper = ({
  topicId,
  topicIds,
  activeTopic,
  subjectId,
  subjectType,
  subTopicId,
  setBreadCrumb,
  showResources,
  subject,
}: Props) => {
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
          prettyUrl: enablePrettyUrls,
        },
      },
      onCompleted: (data) => {
        const topic = data.topic;
        if (topic) {
          const topicPath = topic.context?.parents ?? [];
          const newCrumbs = topicPath
            .map((tp) => ({
              to: (enablePrettyUrls ? tp.url : tp.path) || "",
              name: tp.name,
            }))
            .slice(1);
          setBreadCrumb(newCrumbs.concat({ to: (enablePrettyUrls ? topic.url : topic.path) || "", name: topic.name }));
        }
      },
    },
  );

  if (error) {
    handleError(error);
    const accessDeniedErrors = findAccessDeniedErrors(error);
    if (accessDeniedErrors.length > 0) {
      const nonRecoverableError = accessDeniedErrors.some(
        (e) => !e.path?.includes("coreResources") && !e.path?.includes("supplementaryResources"),
      );

      if (nonRecoverableError) {
        navigate("/403", { replace: true });
      }
    } else if (isNotFoundError(error)) {
      navigate("/404", { replace: true });
    } else {
      return <DefaultErrorMessage />;
    }
  }

  if (loading || !data?.topic?.article) {
    return <PageSpinner />;
  }

  return (
    <SubjectTopic
      key={topicId}
      topicIds={topicIds}
      topic={data.topic}
      resourceTypes={data.resourceTypes}
      activeTopic={activeTopic}
      subjectType={subjectType}
      childId={subTopicId}
      showResources={showResources}
      subject={subject}
      loading={loading}
    />
  );
};

TopicWrapper.fragments = {
  root: gql`
    fragment TopicWrapper_Root on Node {
      ...Topic_Root
    }
    ${topicFragments.root}
  `,
};
export default TopicWrapper;
