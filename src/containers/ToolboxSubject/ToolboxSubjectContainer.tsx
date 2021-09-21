/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { withTracker } from '@ndla/tracker';
import { OneColumn, SubjectBanner, ToolboxInfo } from '@ndla/ui';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  useTranslation,
  withTranslation,
  WithTranslation,
} from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { getSubjectLongName } from '../../data/subjects';
import { GQLSubject, GQLTopic } from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import { toTopic } from '../../routeHelpers';
import { htmlTitle } from '../../util/titleHelper';
import { getAllDimensions } from '../../util/trackingUtil';
import { parseAndMatchUrl } from '../../util/urlHelper';
import ToolboxTopicWrapper from './components/ToolboxTopicWrapper';

interface Props extends WithTranslation, RouteComponentProps {
  data: { subject: GQLSubject & { allTopics: GQLTopic[] } };
  topicList: string[];
  locale: LocaleType;
}

const getDocumentTitle = ({ t, data }: Props) => {
  return htmlTitle(data.subject.name, [t('htmlTitles.titleTemplate')]);
};

const ToolboxSubjectContainer = ({
  topicList,
  locale,
  data,
  history,
}: Props) => {
  const { t } = useTranslation();

  const refs = topicList.map(() => React.createRef<HTMLDivElement>());
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    topicList.forEach((topicId: string) => {
      const alreadySelected = selectedTopics.find(topic => topic === topicId);
      if (!alreadySelected) {
        const exist = subject?.allTopics.find(
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
    <>
      <Helmet>
        <title>
          {htmlTitle(data.subject?.name, [t('htmlTitles.titleTemplate')])}
        </title>
      </Helmet>
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
    </>
  );
};

ToolboxSubjectContainer.getDocumentTitle = getDocumentTitle;

ToolboxSubjectContainer.willTrackPageView = (
  trackPageView: (item: Props) => void,
  currentProps: Props,
) => {
  if (currentProps.data.subject) {
    trackPageView(currentProps);
  }
};

ToolboxSubjectContainer.getDimensions = (props: Props) => {
  const { data, locale, topicList } = props;
  const topicPath = topicList.map(t =>
    data.subject.allTopics.find(topic => topic.id === t),
  );

  const longName = getSubjectLongName(data.subject?.id, locale);
  const article = data.subject.allTopics?.find(t => t.id === topicList[0])
    ?.article;

  return getAllDimensions(
    {
      subject: data.subject,
      topicPath,
      filter: longName,
      article,
    },
    undefined,
    topicList.length > 0,
  );
};

export default withTranslation()(
  withRouter(withTracker(ToolboxSubjectContainer)),
);
