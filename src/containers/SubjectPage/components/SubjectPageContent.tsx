/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction } from "react";
import { gql } from "@apollo/client";
import { SimpleBreadcrumbItem } from "@ndla/ui";
import TopicWrapper from "./TopicWrapper";
import NavigationBox from "../../../components/NavigationBox";
import { RELEVANCE_SUPPLEMENTARY } from "../../../constants";
import { GQLSubjectPageContent_SubjectFragment } from "../../../graphqlTypes";
import { toTopic } from "../../../routeHelpers";

interface Props {
  subject: GQLSubjectPageContent_SubjectFragment;
  topicIds: Array<string>;
  setBreadCrumb: Dispatch<SetStateAction<SimpleBreadcrumbItem[]>>;
}

const PAGE = "page" as const;

const SubjectPageContent = ({ subject, topicIds, setBreadCrumb }: Props) => {
  const mainTopics = subject?.topics?.map((topic) => {
    return {
      ...topic,
      label: topic?.name,
      current: topicIds.length === 1 && topic?.id === topicIds[0] ? PAGE : topic?.id === topicIds[0],
      url: toTopic(subject.id, topic?.id),
      isRestrictedResource: topic.availability !== "everyone",
      isAdditionalResource: topic.relevanceId === RELEVANCE_SUPPLEMENTARY,
    };
  });

  return (
    <>
      <NavigationBox items={mainTopics || []} />
      {topicIds.map((topicId, index) => {
        return (
          <TopicWrapper
            key={topicId}
            topicId={topicId}
            subjectId={subject.id}
            setBreadCrumb={setBreadCrumb}
            subTopicId={topicIds[index + 1]}
            showResources={!topicIds[index + 1]}
            subject={subject}
          />
        );
      })}
    </>
  );
};

SubjectPageContent.fragments = {
  subject: gql`
    fragment SubjectPageContent_Subject on Subject {
      topics {
        name
        id
        availability
        relevanceId
      }
      ...TopicWrapper_Subject
    }
    ${TopicWrapper.fragments.subject}
  `,
};

export default SubjectPageContent;
