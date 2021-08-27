/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
// @ts-ignore
import { OneColumn, ToolboxInfo, SubjectBanner } from '@ndla/ui';
// @ts-ignore
import { getUrnIdsFromProps, toTopic } from '../../routeHelpers';
import { useGraphQuery } from '../../util/runQueries';
import { subjectPageQuery } from '../../queries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { GQLTopic, GQLSubject } from '../../graphqlTypes';
import ToolboxTopicWrapper from './components/ToolboxTopicWrapper';
import { LocaleType } from '../../interfaces';
import { getSubjectLongName } from '../../data/subjects';

interface Props extends RouteComponentProps {
  locale: LocaleType;
}

interface Data {
  subject: GQLSubject & { allTopics: GQLTopic[] };
}

const ToolboxSubjectPage = ({ match, locale }: Props) => {
  const { t } = useTranslation();
  const { subjectId, topicList } = getUrnIdsFromProps({
    ndlaFilm: false,
    match,
  });

  const refs = topicList.map(() => React.createRef<HTMLDivElement>());
  const [selectedTopics, setSelectedTopics] = useState<GQLTopic[]>([]);
  const { loading, data } = useGraphQuery<Data>(subjectPageQuery, {
    variables: {
      subjectId,
    },
  });

  useEffect(() => {
    topicList.forEach((topicId: string) => {
      const alreadySelected = selectedTopics.find(
        (topic: GQLTopic) => topic.id === topicId,
      );
      if (!alreadySelected) {
        const exist = subject.allTopics.find(
          (topic: GQLTopic) => topic.id === topicId,
        );
        if (exist) setSelectedTopics([exist, ...selectedTopics]);
      }
    });
    scrollToTopic(topicList.length - 1);
  });

  const scrollToTopic = (index: number) => {
    const ref = refs[index];
    if (ref && ref.current) {
      const positionFromTop =
        ref.current.getBoundingClientRect().top +
          document?.documentElement?.scrollTop || 100;
      window.scrollTo({
        top: positionFromTop - 185,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return null;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  const subject = data.subject;

  const topics = subject.topics?.map((topic: GQLTopic) => {
    return {
      ...topic,
      label: topic.name,
      selected: topic.id === topicList[0],
      url: toTopic(subject.id, topic.id),
    };
  });

  const onSelectTopic = (index: number, id?: string) => {
    const topic = subject.allTopics?.find((topic: GQLTopic) => topic.id === id);
    if (topic) {
      if (index === 0) {
        setSelectedTopics([topic]);
      } else if (index > 0) {
        setSelectedTopics([...selectedTopics.slice(0, index), topic]);
      }
    }
  };

  const TopicBoxes = () => (
    <>
      {selectedTopics.map((topic: GQLTopic, index: number) => {
        return (
          <div key={index} ref={refs[index]}>
            <ToolboxTopicWrapper
              subjectId={subject.id}
              topicId={topic.id}
              locale={locale}
              onSelectTopic={onSelectTopic}
              topicList={topicList}
              index={index}
            />
          </div>
        );
      })}
    </>
  );

  if (!topics) {
    return null;
  }

  return (
    <OneColumn className={''}>
      <ToolboxInfo
        topics={topics}
        onSelectTopic={(_e: React.MouseEvent<HTMLElement>, id?: string) =>
          onSelectTopic(0, id)
        }
        title={getSubjectLongName(subject.id, locale) || subject.name}
        introduction={t('htmlTitles.toolbox.introduction')}
      />
      <TopicBoxes />
      <SubjectBanner negativeTopMargin={!topics} />
    </OneColumn>
  );
};

export default ToolboxSubjectPage;
