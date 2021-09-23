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
import { parseAndMatchUrl } from '../../util/urlHelper';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import {
  GQLTopic,
  GQLSubjectPageQuery,
  GQLSubjectPageQueryVariables,
} from '../../graphqlTypes';
import ToolboxTopicWrapper from './components/ToolboxTopicWrapper';
import { LocaleType } from '../../interfaces';
import { getSubjectLongName } from '../../data/subjects';

interface Props extends RouteComponentProps {
  locale: LocaleType;
}

const ToolboxSubjectPage = ({ history, match, locale }: Props) => {
  const { t } = useTranslation();
  const { subjectId, topicList } = getUrnIdsFromProps({
    ndlaFilm: false,
    match,
  });

  const refs = topicList.map(() => React.createRef<HTMLDivElement>());
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const { loading, data } = useGraphQuery<
    GQLSubjectPageQuery,
    GQLSubjectPageQueryVariables
  >(subjectPageQuery, {
    variables: {
      subjectId: subjectId!,
    },
  });

  useEffect(() => {
    topicList.forEach((topicId: string) => {
      const alreadySelected = selectedTopics.find(topic => topic === topicId);
      if (!alreadySelected) {
        const exist = subject?.allTopics?.find(
          (topic: GQLTopic) => topic.id === topicId,
        );
        if (exist) setSelectedTopics([exist.id, ...selectedTopics]);
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

  if (!data?.subject) {
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

  const onSelectTopic = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number,
    id?: string,
  ) => {
    e.preventDefault();
    if (id) {
      const topic = subject.allTopics?.find(
        (topic: GQLTopic) => topic.id === id,
      );
      if (topic) {
        if (index === 0) {
          setSelectedTopics([topic.id]);
        } else if (index > 0) {
          const updatedSelectedTopics = selectedTopics.slice(0, index + 1);
          updatedSelectedTopics[index] = id;
          setSelectedTopics(updatedSelectedTopics);
        }
        const path = parseAndMatchUrl(e.currentTarget?.href, true);
        history.replace({
          pathname: path?.url,
        });
      }
    }
  };

  const TopicBoxes = () => (
    <>
      {selectedTopics.map((topic: string, index: number) => {
        return (
          <div key={index} ref={refs[index]}>
            <ToolboxTopicWrapper
              subjectId={subject.id}
              topicId={topic}
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
        onSelectTopic={(e: React.MouseEvent<HTMLElement>, id?: string) =>
          onSelectTopic(e as React.MouseEvent<HTMLAnchorElement>, 0, id)
        }
        title={getSubjectLongName(subject.id, locale) || subject.name}
        introduction={t('htmlTitles.toolbox.introduction')}
      />
      <TopicBoxes />
      <SubjectBanner image={''} negativeTopMargin={!topics} />
    </OneColumn>
  );
};

export default ToolboxSubjectPage;
