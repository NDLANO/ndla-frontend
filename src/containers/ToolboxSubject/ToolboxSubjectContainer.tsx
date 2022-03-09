/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { withTracker } from '@ndla/tracker';
import { OneColumn, SubjectBanner, ToolboxInfo } from '@ndla/ui';
import { useEffect, useState, MouseEvent, createRef } from 'react';
import { Helmet } from 'react-helmet';
import {
  useTranslation,
  withTranslation,
  WithTranslation,
} from 'react-i18next';
import { RouteComponentProps, useLocation, withRouter } from 'react-router';
import { getSubjectLongName } from '../../data/subjects';
import { GQLSubjectPageQuery } from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import { toTopic } from '../../routeHelpers';
import { htmlTitle } from '../../util/titleHelper';
import { getAllDimensions } from '../../util/trackingUtil';
import { parseAndMatchUrl } from '../../util/urlHelper';
import { ToolboxTopicContainer } from './components/ToolboxTopicContainer';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { FeideUserWithGroups } from '../../util/feideApi';

export type ToolboxSubjectType = Required<GQLSubjectPageQuery>['subject'];

interface Props extends WithTranslation, RouteComponentProps {
  subject: ToolboxSubjectType;
  topicList: string[];
  locale: LocaleType;
  user?: FeideUserWithGroups;
}

const getSocialMediaMetaData = (
  { subject, topicList, t }: Props,
  selectedTopics?: string[],
) => {
  const topics = selectedTopics ?? getInitialSelectedTopics(topicList, subject);

  const selectedMetadata = [...(subject.allTopics ?? [])]
    .reverse()
    .find(t => topics.includes(t.id));

  const selectedTitle = selectedMetadata?.name || selectedMetadata?.meta?.title;
  const subjectTitle = subject.name || subject.subjectpage?.about?.title;
  const hasSelectedTitle = !!selectedTitle;
  const title = htmlTitle(hasSelectedTitle ? selectedTitle : subjectTitle, [
    hasSelectedTitle ? subjectTitle : undefined,
  ]);

  return {
    title,
    description:
      selectedMetadata?.meta?.metaDescription ||
      selectedMetadata?.meta?.introduction ||
      subject.subjectpage?.about?.description ||
      subject.subjectpage?.metaDescription ||
      t('frontpageMultidisciplinarySubject.text'),
    image:
      selectedMetadata?.meta?.metaImage ||
      subject.subjectpage?.about?.visualElement,
  };
};

const getDocumentTitle = (props: Props) => {
  return getSocialMediaMetaData(props).title;
};

const getInitialSelectedTopics = (
  topicList: string[],
  subject: ToolboxSubjectType,
): string[] => {
  let initialSelectedTopics: string[] = [];
  topicList.forEach(topicId => {
    const alreadySelected = initialSelectedTopics.find(
      topic => topic === topicId,
    );
    if (!alreadySelected) {
      const exist = subject?.allTopics?.find(topic => topic.id === topicId);
      if (exist) initialSelectedTopics = [exist.id, ...initialSelectedTopics];
    }
  });

  return initialSelectedTopics;
};

const ToolboxSubjectContainer = (props: Props) => {
  const { topicList, locale, subject, history } = props;
  const { t } = useTranslation();
  const location = useLocation();

  const refs = topicList.map(() => createRef<HTMLDivElement>());
  const initialSelectedTopics = getInitialSelectedTopics(topicList, subject);
  const [selectedTopics, setSelectedTopics] = useState(initialSelectedTopics);

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

  useEffect(() => {
    scrollToTopic(topicList.length - 1);
  });

  useEffect(() => {
    const topics = location.pathname
      .split('/')
      .filter(id => id.startsWith('topic'))
      .map(id => `urn:${id}`);
    setSelectedTopics(topics);
  }, [location]);

  const topics = subject.topics?.map(topic => {
    return {
      ...topic,
      label: topic.name,
      selected: topic.id === topicList[0],
      url: toTopic(subject.id, topic.id),
    };
  });

  const onSelectTopic = (
    e: MouseEvent<HTMLAnchorElement>,
    index: number,
    id?: string,
  ) => {
    e.preventDefault();
    if (id) {
      const topic = subject.allTopics?.find(topic => topic.id === id);
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
            <ToolboxTopicContainer
              subject={subject}
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

  const socialMediaMetaData = getSocialMediaMetaData(props, selectedTopics);

  const imageUrlObj = socialMediaMetaData.image?.url
    ? { url: socialMediaMetaData.image.url }
    : undefined;
  return (
    <>
      <Helmet>
        <title>
          {htmlTitle(socialMediaMetaData.title, [
            t('htmlTitles.titleTemplate'),
          ])}
        </title>
        {socialMediaMetaData.description && (
          <meta name="description" content={socialMediaMetaData.description} />
        )}
      </Helmet>
      <SocialMediaMetadata
        title={socialMediaMetaData.title}
        description={socialMediaMetaData.description}
        locale={locale}
        image={imageUrlObj}
      />
      <OneColumn className={''}>
        <ToolboxInfo
          topics={topics}
          onSelectTopic={(e: MouseEvent<HTMLElement>, id?: string) =>
            onSelectTopic(e as MouseEvent<HTMLAnchorElement>, 0, id)
          }
          title={getSubjectLongName(subject.id, locale) || subject.name}
          introduction={t('htmlTitles.toolbox.introduction')}
        />
        <TopicBoxes />
        {subject.subjectpage?.banner && (
          <SubjectBanner
            image={subject.subjectpage?.banner.desktopUrl || ''}
            negativeTopMargin={!topics}
          />
        )}
      </OneColumn>
    </>
  );
};

ToolboxSubjectContainer.getDocumentTitle = getDocumentTitle;

ToolboxSubjectContainer.willTrackPageView = (
  trackPageView: (item: Props) => void,
  currentProps: Props,
) => {
  if (currentProps.subject && currentProps.topicList.length === 0) {
    trackPageView(currentProps);
  }
};

ToolboxSubjectContainer.getDimensions = (props: Props) => {
  const { subject, locale, topicList, user } = props;
  const topicPath = topicList.map(t =>
    subject.allTopics?.find(topic => topic.id === t),
  );
  const longName = getSubjectLongName(subject.id, locale);

  return getAllDimensions({
    subject,
    topicPath,
    filter: longName,
    user,
  });
};

export default withTranslation()(
  withRouter(withTracker(ToolboxSubjectContainer)),
);
