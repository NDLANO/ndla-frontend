/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
// @ts-ignore
import {
  // @ts-ignore
  OneColumn,
  // @ts-ignore
  SubjectBanner,
  // @ts-ignore
  LayoutItem,
  NavigationHeading,
  Breadcrumblist,
} from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import { useIntersectionObserver } from '@ndla/hooks';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router';
import SubjectPageContent from './components/SubjectPageContent';
import SubjectEditorChoices from './components/SubjectEditorChoices';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { scrollToRef } from './subjectPageHelpers';
import SubjectPageInformation from './components/SubjectPageInformation';
import { getSubjectBySubjectId, getSubjectLongName } from '../../data/subjects';
import { parseAndMatchUrl } from '../../util/urlHelper';
import { getAllDimensions } from '../../util/trackingUtil';
import { htmlTitle } from '../../util/titleHelper';
import { BreadcrumbItem, LocaleType } from '../../interfaces';
import { GQLSubject, GQLTopic } from '../../graphqlTypes';

type Props = {
  locale: LocaleType;
  skipToContentId?: string;
  subjectId: string;
  topicIds: string[];
  data: { subject: GQLSubject & { allTopics: GQLTopic[] } };
  ndlaFilm?: boolean;
  loading?: boolean;
} & tType &
  RouteComponentProps;

const SubjectContainer = ({
  history,
  locale,
  t,
  subjectId,
  topicIds,
  data,
  ndlaFilm,
}: Props) => {
  const { subject } = data;
  const { name: subjectName } = subject;

  const metaDescription = subject.subjectpage?.metaDescription;
  const about = subject.subjectpage?.about;
  const editorsChoices = subject.subjectpage?.editorsChoices;

  const [currentLevel, setCurrentLevel] = useState<number | string | undefined>(
    0,
  );
  const [breadCrumbList, setBreadCrumbList] = useState<BreadcrumbItem[]>([]);

  const [subjectNames] = useState(() => {
    const subjectData = getSubjectBySubjectId(subject.id);
    if (subjectData) {
      return {
        subHeading: undefined,
        name: subjectData.name[locale],
        longName: subjectData.longName[locale],
      };
    }
    // Fallback if subject is missing in static constants
    return {
      subHeading: subjectName,
      name: subjectName,
      longName: subjectName,
    };
  });

  const breadCrumbs: BreadcrumbItem[] = [
    {
      id: subjectId,
      label: subjectNames.name,
      typename: 'Subject',
      url: '#',
      isCurrent: currentLevel === 'Subject',
    },
    ...(breadCrumbList.length > 0
      ? breadCrumbList.map(crumb => ({
          ...crumb,
          isCurrent: currentLevel === crumb.index,
          typename:
            (crumb.index ?? 0) > 0
              ? 'Subtopic'
              : ('Topic' as BreadcrumbItem['typename']),
          url: '#',
        }))
      : []),
  ];

  const setBreadCrumb = (topic: BreadcrumbItem) => {
    setCurrentLevel(topic.index);
    setBreadCrumbList(prevCrumbs => [
      ...prevCrumbs.filter(crumb => {
        return (
          crumb.id.toString().localeCompare(topic.id.toString()) !== 0 &&
          (crumb.typename === 'Subjecttype' ||
            crumb.typename === 'Subject' ||
            topicIds?.includes(crumb.id.toString()))
        );
      }),
      topic,
    ]);
  };

  const headerRef = useRef<HTMLDivElement>(null);
  const topicRefs = topicIds.map(_ => React.createRef<HTMLDivElement>());

  const handleNav = (
    e: React.MouseEvent<HTMLElement>,
    item: BreadcrumbItem,
  ) => {
    e.preventDefault();
    const { typename, index } = item;
    if (typename === 'Subjecttype' || typename === 'Subject') {
      setCurrentLevel(typename);
      scrollToRef(headerRef);
    } else {
      if (index) {
        setCurrentLevel(index);
        const refToScroll = topicRefs[index];
        if (refToScroll) scrollToRef(refToScroll);
      }
    }
  };

  const onClickTopics = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const path = parseAndMatchUrl(e.currentTarget?.href, true);
    history.replace({ pathname: path?.url });
  };

  // show/hide breadcrumb based on intersection
  const [containerRef, { entry }] = useIntersectionObserver({
    root: null,
    rootMargin: '-275px',
  });
  const showBreadCrumb = entry && entry.isIntersecting;
  const moveBannerUp = !topicIds?.length;

  const topicPath = topicIds?.map(t =>
    data.subject.allTopics.find(topic => topic.id === t),
  );

  const socialMediaMetadata = {
    title: topicPath?.[topicPath.length - 1]?.name || about?.title,
    description:
      topicPath?.[topicPath.length - 1]?.meta?.metaDescription ||
      subject.subjectpage?.metaDescription,
    image:
      topicPath?.[topicPath.length - 1]?.meta?.metaImage ||
      about?.visualElement,
  };

  return (
    <>
      <Helmet>
        <title>
          {htmlTitle(subjectNames?.name, [t('htmlTitles.titleTemplate')])}
        </title>
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
      </Helmet>
      <div ref={containerRef}>
        <OneColumn>
          <LayoutItem layout="extend">
            {about && (
              <SocialMediaMetadata
                title={socialMediaMetadata.title}
                description={socialMediaMetadata.description}
                locale={locale}
                image={
                  socialMediaMetadata.image && {
                    url: socialMediaMetadata.image.url,
                    altText: socialMediaMetadata.image.alt,
                  }
                }
              />
            )}
            <div ref={headerRef}>
              <NavigationHeading
                subHeading={subjectNames.subHeading}
                invertedStyle={ndlaFilm}>
                {subjectNames.longName}
              </NavigationHeading>
            </div>
            <SubjectPageContent
              locale={locale}
              subject={subject}
              ndlaFilm={ndlaFilm}
              onClickTopics={onClickTopics}
              topicIds={topicIds}
              refs={topicRefs}
              setBreadCrumb={setBreadCrumb}
            />
          </LayoutItem>
        </OneColumn>
      </div>
      {subject.subjectpage?.banner && (
        <SubjectBanner
          image={subject.subjectpage?.banner.desktopUrl}
          negativeTopMargin={moveBannerUp}
        />
      )}
      {false && subject.subjectpage?.about && (
        <OneColumn wide>
          <SubjectPageInformation subjectpage={subject.subjectpage} wide />
        </OneColumn>
      )}
      {false && (editorsChoices?.length ?? 0) > 0 && (
        <SubjectEditorChoices
          wideScreen
          editorsChoices={editorsChoices}
          locale={locale}
        />
      )}
      <OneColumn wide>
        <Breadcrumblist
          items={breadCrumbs}
          onNav={handleNav}
          invertedStyle={ndlaFilm}
          isVisible={showBreadCrumb}
        />
      </OneColumn>
    </>
  );
};

SubjectContainer.getDocumentTitle = ({ t, data }: Props): string => {
  return htmlTitle(data?.subject?.name, [t('htmlTitles.titleTemplate')]);
};

SubjectContainer.willTrackPageView = (
  trackPageView: (p: Props) => void,
  currentProps: Props,
) => {
  const { data, loading, topicIds } = currentProps;
  if (
    !loading &&
    (data?.subject?.topics?.length ?? 0) > 0 &&
    topicIds?.length === 0
  ) {
    trackPageView(currentProps);
  }
};

SubjectContainer.getDimensions = (props: Props) => {
  const { data, locale, topicIds } = props;
  const topicPath = topicIds.map(t =>
    data.subject.allTopics.find(topic => topic.id === t),
  );
  const longName = getSubjectLongName(data.subject?.id, locale);

  return getAllDimensions({
    subject: data.subject,
    topicPath,
    filter: longName,
  });
};

export default withRouter(injectT(withTracker(SubjectContainer)));
