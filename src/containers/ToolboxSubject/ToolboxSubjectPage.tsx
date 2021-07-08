/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom'
// @ts-ignore
import { OneColumn, ToolboxInfo, SubjectBanner } from '@ndla/ui';
// @ts-ignore
import { getUrnIdsFromProps, toTopic } from '../../routeHelpers';
import { useGraphQuery } from '../../util/runQueries';
import { subjectPageQuery } from '../../queries';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import { GQLTopic } from '../../graphqlTypes';
import ToolboxTopicWrapper from './components/ToolboxTopicWrapper';
import { LocaleType } from '../../interfaces';

type Props = {
  match: RouteComponentProps['match'];
  locale: LocaleType;
};

const ToolboxSubjectPage = ({ match, locale }: Props) => {
  const { subjectId, topicList } = getUrnIdsFromProps({
    ndlaFilm: false,
    match,
  });

  const refs = topicList.map(() => React.createRef());
  const [selectedTopics, setSelectedTopics] = useState<GQLTopic[]>([]);
  const { loading, data } = useGraphQuery(subjectPageQuery, {
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
        setSelectedTopics([
          subject.allTopics.find((topic: GQLTopic) => topic.id === topicId),
          ...selectedTopics,
        ]);
      } 
    });
    scrollToTopic(topicList.length - 1);
  });

  if (loading) {
    return null;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  const subject = data.subject;
  const topics = subject.topics.map((topic: GQLTopic) => {
    return {
      ...topic,
      label: topic.name,
      selected: topic.id === topicList[0],
      url: toTopic(subject.id, topic.id),
    };
  });

  const scrollToTopic = (index: number) => {
    const ref = refs[index];
    const positionFromTop =
      ref?.current?.getBoundingClientRect().top +
        document?.documentElement?.scrollTop || 100;
    window.scrollTo({
      top: positionFromTop - 100,
      behavior: 'smooth',
    });
  };

  const onSelectTopic = (index: number, id?: string) => {
    if (index === 0) {
      setSelectedTopics([topics.find((topic: GQLTopic) => topic.id === id)]);
    } else if (index > 0) {
      setSelectedTopics([
        ...selectedTopics.slice(0, index),
        subject.allTopics.find((topic: GQLTopic) => topic.id === id),
      ]);
    }
  };

  const TopicBoxes = () =>
    selectedTopics.map((topic: GQLTopic, index: number) => {
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
    });

  return (
    <OneColumn>
      <ToolboxInfo
        topics={topics}
        onSelectTopic={(_e: React.MouseEvent<HTMLElement>, id?: string) =>
          onSelectTopic(0, id)
        }
        title="Verktøykassa"
        introduction="Hva vil det si å arbeide utforskende? Hvordan kan du lære bedre? Hva skal til for å få gruppearbeid til å fungere? I Verktøykassa finner både elever og lærere ressurser som er aktuelle for alle fag, og som støtter opp under læringsarbeid og utvikling av kunnskap, ferdigheter og forståelse."
      />
      <TopicBoxes />
      <SubjectBanner negativeTopMargin={!topics.length} />
    </OneColumn>
  );
};

export default ToolboxSubjectPage;
