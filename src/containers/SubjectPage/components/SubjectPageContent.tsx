/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { RefObject, useEffect } from 'react';
import { NavigationBox } from '@ndla/ui';
import { RELEVANCE_SUPPLEMENTARY } from '../../../constants';
import { scrollToRef } from '../subjectPageHelpers';
import { toTopic, useIsNdlaFilm } from '../../../routeHelpers';
import TopicWrapper from './TopicWrapper';
import { BreadcrumbItem } from '../../../interfaces';
import { GQLSubjectPageContent_SubjectFragment } from '../../../graphqlTypes';

interface Props {
  subject: GQLSubjectPageContent_SubjectFragment;
  topicIds: Array<string>;
  refs: Array<RefObject<HTMLDivElement>>;
  setBreadCrumb: (topic: BreadcrumbItem) => void;
}

const SubjectPageContent = ({
  subject,
  topicIds,
  refs,
  setBreadCrumb,
}: Props) => {
  const ndlaFilm = useIsNdlaFilm();
  useEffect(() => {
    if (topicIds.length) scrollToRef(refs[topicIds.length - 1]!);
  }, [topicIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const mainTopics = subject?.topics?.map((topic) => {
    return {
      ...topic,
      label: topic?.name,
      selected: topic?.id === topicIds[0],
      url: toTopic(subject.id, topic?.id),
      isRestrictedResource: topic.availability !== 'everyone',
      isAdditionalResource: topic.relevanceId === RELEVANCE_SUPPLEMENTARY,
    };
  });

  return (
    <>
      <NavigationBox
        items={mainTopics || []}
        invertedStyle={ndlaFilm}
        listDirection="horizontal"
      />
      {topicIds.map((topicId, index) => {
        return (
          <div ref={refs[index]} key={index}>
            <TopicWrapper
              topicId={topicId}
              subjectId={subject.id}
              setBreadCrumb={setBreadCrumb}
              subTopicId={topicIds[index + 1]}
              index={index}
              showResources={!topicIds[index + 1]}
              subject={subject}
            />
          </div>
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
