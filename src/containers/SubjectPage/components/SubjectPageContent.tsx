/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { NavigationBox } from '@ndla/ui';
import { scrollToRef } from '../subjectPageHelpers';
import { toTopic } from '../../../routeHelpers';
import TopicWrapper from './TopicWrapper';
import { GQLSubject, GQLTopic } from '../../../graphqlTypes';
import { BreadcrumbItem, LocaleType } from '../../../interfaces';

interface Props {
  subject: GQLSubject & { allTopics: GQLTopic[] };
  locale: LocaleType;
  ndlaFilm?: boolean;
  onClickTopics: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  topics: Array<string>;
  refs: any[];
  setBreadCrumb: (topic: BreadcrumbItem) => void;
}

const SubjectPageContent = ({
  subject,
  locale,
  ndlaFilm,
  onClickTopics,
  topics,
  refs,
  setBreadCrumb,
  t,
}: Props & tType) => {
  useEffect(() => {
    if (topics.length) scrollToRef(refs[topics.length - 1]);
  }, [topics]); // eslint-disable-line react-hooks/exhaustive-deps

  const mainTopics = subject?.topics!.map(topic => {
    return {
      ...topic,
      label: topic!.name,
      selected: topic!.id === topics[0],
      url: toTopic(subject.id, topic!.id),
    };
  });

  return (
    <>
      <NavigationBox
        items={mainTopics}
        invertedStyle={ndlaFilm}
        listDirection="horizontal"
        onClick={e => {
          onClickTopics(e as React.MouseEvent<HTMLAnchorElement>);
        }}
      />
      {topics.map((topicId, index) => {
        return (
          <div ref={refs[index]} key={index}>
            <TopicWrapper
              topicId={topicId}
              subjectId={subject.id}
              setBreadCrumb={setBreadCrumb}
              subTopicId={topics[index + 1]!}
              locale={locale}
              ndlaFilm={ndlaFilm}
              onClickTopics={onClickTopics}
              index={index}
              showResources={!topics[index + 1]}
              subject={subject}
              t={t}
            />
          </div>
        );
      })}
    </>
  );
};

export default injectT(SubjectPageContent);
