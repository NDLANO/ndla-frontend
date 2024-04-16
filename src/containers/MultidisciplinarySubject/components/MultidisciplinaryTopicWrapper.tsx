/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Dispatch, SetStateAction } from "react";
import { gql } from "@apollo/client";
import { Spinner } from "@ndla/icons";
import { SimpleBreadcrumbItem } from "@ndla/ui";
import MultidisciplinaryArticleList from "./MultidisciplinaryArticleList";
import MultidisciplinaryTopic, { multidisciplinaryTopicFragments } from "./MultidisciplinaryTopic";
import DefaultErrorMessage from "../../../components/DefaultErrorMessage";
import {
  GQLMultidisciplinaryTopicWrapperQuery,
  GQLMultidisciplinaryTopicWrapperQueryVariables,
  GQLMultidisciplinaryTopic_SubjectFragment,
} from "../../../graphqlTypes";
import { removeUrn } from "../../../routeHelpers";
import { useGraphQuery } from "../../../util/runQueries";

interface Props {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  subject: GQLMultidisciplinaryTopic_SubjectFragment;
  setCrumbs: Dispatch<SetStateAction<SimpleBreadcrumbItem[]>>;
  disableNav?: boolean;
  index: number;
  showSubtopics?: boolean;
}

const multidisciplinaryTopicWrapperQuery = gql`
  query multidisciplinaryTopicWrapper(
    $topicId: String!
    $subjectId: String
    $showSubtopics: Boolean!
    $transformArgs: TransformedArticleContentInput
  ) {
    topic(id: $topicId, subjectId: $subjectId) {
      id
      subtopics @include(if: $showSubtopics) {
        ...MultidisciplinaryArticleList_Topic
      }
      ...MultidisciplinaryTopic_Topic
    }
  }
  ${MultidisciplinaryArticleList.fragments.topic}
  ${multidisciplinaryTopicFragments.topic}
`;

const MultidisciplinaryTopicWrapper = ({
  topicId,
  subjectId,
  subTopicId,
  subject,
  setCrumbs,
  index,
  disableNav,
  showSubtopics,
}: Props) => {
  const { data, loading } = useGraphQuery<
    GQLMultidisciplinaryTopicWrapperQuery,
    GQLMultidisciplinaryTopicWrapperQueryVariables
  >(multidisciplinaryTopicWrapperQuery, {
    variables: {
      topicId,
      subjectId,
      showSubtopics: !!showSubtopics,
      transformArgs: {
        subjectId,
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
  });

  if (loading) {
    return <Spinner />;
  }

  if (!data?.topic) {
    return <DefaultErrorMessage />;
  }

  return (
    <>
      <MultidisciplinaryTopic
        topic={data.topic}
        topicId={topicId}
        subjectId={subjectId}
        subTopicId={subTopicId}
        subject={subject}
        disableNav={disableNav}
      />
      {showSubtopics && (
        <MultidisciplinaryArticleList
          topics={data.topic?.subtopics ?? []}
          subjects={[subject.name]}
          totalCount={data.topic?.subtopics?.length ?? 0}
        />
      )}
    </>
  );
};

MultidisciplinaryTopicWrapper.fragments = {
  subject: gql`
    fragment MultidisciplinaryTopicWrapper_Subject on Subject {
      ...MultidisciplinaryTopic_Subject
    }
    ${multidisciplinaryTopicFragments.subject}
  `,
};

export default MultidisciplinaryTopicWrapper;
