/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { withTracker } from '@ndla/tracker';
import {
  FeideUserApiType,
  OneColumn,
  SubjectBanner,
  ToolboxInfo,
} from '@ndla/ui';
import { useEffect, createRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  useTranslation,
  withTranslation,
  WithTranslation,
} from 'react-i18next';
import { getSubjectLongName } from '../../data/subjects';
import { GQLToolboxSubjectContainer_SubjectFragment } from '../../graphqlTypes';
import { toTopic } from '../../routeHelpers';
import { htmlTitle } from '../../util/titleHelper';
import { getAllDimensions } from '../../util/trackingUtil';
import { ToolboxTopicContainer } from './components/ToolboxTopicContainer';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';

interface Props extends WithTranslation {
  subject: GQLToolboxSubjectContainer_SubjectFragment;
  topicList: string[];
  user?: FeideUserApiType;
}

const getSocialMediaMetaData = (
  { subject, topicList, t }: Pick<Props, 'subject' | 'topicList' | 't'>,
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
  subject: GQLToolboxSubjectContainer_SubjectFragment,
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

const ToolboxSubjectContainer = ({ topicList, subject }: Props) => {
  const { t, i18n } = useTranslation();
  const selectedTopics = topicList;

  const refs = topicList.map(() => createRef<HTMLDivElement>());

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

  const topics = subject.topics?.map(topic => {
    return {
      ...topic,
      label: topic.name,
      selected: topic.id === topicList[0],
      url: toTopic(subject.id, topic.id),
    };
  });

  const TopicBoxes = () => (
    <>
      {selectedTopics.map((topic: string, index: number) => {
        return (
          <div key={index} ref={refs[index]}>
            <ToolboxTopicContainer
              subject={subject}
              topicId={topic}
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

  const socialMediaMetaData = getSocialMediaMetaData(
    { subject, topicList, t },
    selectedTopics,
  );

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
        imageUrl={socialMediaMetaData.image?.url}
      />
      <OneColumn className={''}>
        <ToolboxInfo
          topics={topics}
          title={getSubjectLongName(subject.id, i18n.language) || subject.name}
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

export const toolboxSubjectContainerFragments = {
  subject: gql`
    fragment ToolboxSubjectContainer_Subject on Subject {
      topics {
        name
        id
      }
      allTopics {
        id
        name
        meta {
          metaDescription
          introduction
          title
          metaImage {
            url
          }
        }
      }
      subjectpage {
        about {
          title
          description
          visualElement {
            url
          }
        }
        banner {
          desktopUrl
        }
        metaDescription
      }
      ...ToolboxTopicContainer_Subject
    }
    ${ToolboxTopicContainer.fragments.subject}
  `,
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
  const { subject, topicList, user } = props;
  const topicPath = topicList.map(t =>
    subject.allTopics?.find(topic => topic.id === t),
  );
  const longName = getSubjectLongName(subject.id);

  return getAllDimensions({
    subject,
    topicPath,
    filter: longName,
    user,
  });
};

export default withTranslation()(withTracker(ToolboxSubjectContainer));
