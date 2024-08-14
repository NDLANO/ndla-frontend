/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef } from "react";
import { Navigate } from "react-router-dom";
import { gql } from "@apollo/client";
import MovedTopicPage from "./components/MovedTopicPage";
import SubjectContainer, { subjectContainerFragments } from "./SubjectContainer";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import { OLD_SUBJECT_PAGE_REDIRECT_CUSTOM_FIELD } from "../../constants";
import { GQLSubjectPageTestQuery, GQLSubjectPageTestQueryVariables } from "../../graphqlTypes";
import { useUrnIds } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const subjectPageQuery = gql`
  query subjectPageTest(
    $subjectId: String!
    $topicId: String!
    $includeTopic: Boolean!
    $metadataFilterKey: String
    $metadataFilterValue: String
  ) {
    subject: node(id: $subjectId) {
      ...SubjectContainer_Subject
    }
    topic: node(id: $topicId, rootId: $subjectId) @include(if: $includeTopic) {
      alternateTopics: alternateNodes {
        ...MovedTopicPage_Topic
      }
    }
    subjects: nodes(
      metadataFilterKey: $metadataFilterKey
      metadataFilterValue: $metadataFilterValue
      filterVisible: true
    ) {
      path
      metadata {
        customFields
      }
    }
  }
  ${MovedTopicPage.fragments.topic}
  ${subjectContainerFragments.subject}
`;

const SubjectPage = () => {
  const { subjectId, topicId, topicList } = useUrnIds();

  const initialLoad = useRef(true);
  const isFirstRenderWithTopicId = () => initialLoad.current && !!topicId;

  const {
    loading,
    data: newData,
    previousData,
  } = useGraphQuery<GQLSubjectPageTestQuery, GQLSubjectPageTestQueryVariables>(subjectPageQuery, {
    variables: {
      subjectId: subjectId!,
      topicId: topicId || "",
      includeTopic: isFirstRenderWithTopicId(),
      metadataFilterKey: OLD_SUBJECT_PAGE_REDIRECT_CUSTOM_FIELD,
      metadataFilterValue: subjectId,
    },
  });

  const data = newData ?? previousData;

  if (!data && !loading) {
    return <DefaultErrorMessage />;
  }

  if (!data) {
    return <ContentPlaceholder />;
  }

  const alternateTopics = data.topic?.alternateTopics;
  if (alternateTopics && alternateTopics.length >= 1) {
    // if (alternateTopics.length === 1) {
    //   return <Navigate to={alternateTopics[0]!.path!} replace />;
    // }
    return <MovedTopicPage topics={alternateTopics} />;
  }

  if (!data.subject || !subjectId) {
    const redirect = data.subjects?.[0];
    if (!redirect) {
      return <NotFoundPage />;
    } else {
      return <Navigate to={redirect.path || ""} replace />;
    }
  }

  // Pre-select topic if only one topic in subject
  if (!topicList.length && data.subject?.topics?.length === 1) {
    const topic = data.subject.topics[0];
    topicList.push(topic!.id);
  }

  initialLoad.current = false;

  return <SubjectContainer topicIds={topicList} subject={data.subject} loading={loading} />;
};

export default SubjectPage;
