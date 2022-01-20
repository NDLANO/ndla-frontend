/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { RefObject, useEffect } from 'react';
import { NavigationBox } from '@ndla/ui';
import { RELEVANCE_SUPPLEMENTARY } from '../../../constants';
import { scrollToRef } from '../subjectPageHelpers';
import { toTopic } from '../../../routeHelpers';
import TopicWrapper from './TopicWrapper';
import { GQLSubject } from '../../../graphqlTypes';
import { BreadcrumbItem, LocaleType } from '../../../interfaces';

interface Props {
  subject: GQLSubject;
  locale: LocaleType;
  ndlaFilm?: boolean;
  onClickTopics: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  topicIds: Array<string>;
  refs: Array<RefObject<HTMLDivElement>>;
  setBreadCrumb: (topic: BreadcrumbItem) => void;
}

const SubjectPageContent = ({
  subject,
  locale,
  ndlaFilm,
  onClickTopics,
  topicIds,
  refs,
  setBreadCrumb,
}: Props) => {
  useEffect(() => {
    if (topicIds.length) scrollToRef(refs[topicIds.length - 1]!);
  }, [topicIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const mainTopics = subject?.topics?.map(topic => {
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
        onClick={e => {
          onClickTopics(e as React.MouseEvent<HTMLAnchorElement>);
        }}
      />
      {topicIds.map((topicId, index) => {
        return (
          <div ref={refs[index]} key={index}>
            <TopicWrapper
              topicId={topicId}
              subjectId={subject.id}
              setBreadCrumb={setBreadCrumb}
              subTopicId={topicIds[index + 1]}
              locale={locale}
              ndlaFilm={ndlaFilm}
              onClickTopics={onClickTopics}
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

export default SubjectPageContent;
