/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import {
  ComponentType,
  ReactNode,
  useState,
  useRef,
  createRef,
  MouseEvent,
} from 'react';
import { Helmet } from 'react-helmet';
import {
  ArticleHeaderWrapper,
  OneColumn,
  SubjectBanner,
  LayoutItem,
  NavigationHeading,
  Breadcrumblist,
  MessageBox,
} from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
import { useIntersectionObserver } from '@ndla/hooks';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router';
import { withTranslation, WithTranslation, TFunction } from 'react-i18next';
import SubjectPageContent from './components/SubjectPageContent';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { scrollToRef } from './subjectPageHelpers';
import CompetenceGoals from '../../components/CompetenceGoals';
import { getSubjectBySubjectId, getSubjectLongName } from '../../data/subjects';
import { parseAndMatchUrl } from '../../util/urlHelper';
import { getAllDimensions } from '../../util/trackingUtil';
import { htmlTitle } from '../../util/titleHelper';
import { BreadcrumbItem, LocaleType } from '../../interfaces';
import { GQLSubjectContainer_SubjectFragment } from '../../graphqlTypes';
import { FeideUserWithGroups } from '../../util/feideApi';

type Props = {
  locale: LocaleType;
  skipToContentId?: string;
  subjectId: string;
  topicIds: string[];
  subject: GQLSubjectContainer_SubjectFragment;
  ndlaFilm?: boolean;
  loading?: boolean;
  user?: FeideUserWithGroups;
} & WithTranslation &
  RouteComponentProps;

const getSubjectCategoryMessage = (
  subjectCategory: string | undefined,
  t: TFunction,
): string | undefined => {
  if (!subjectCategory || subjectCategory === 'active') {
    return undefined;
  } else if (subjectCategory === 'beta') {
    return t('messageBoxInfo.beta');
  } else if (subjectCategory === 'archive') {
    return t('messageBoxInfo.outdatedSubject');
  } else {
    return undefined;
  }
};

const SubjectContainer = ({
  history,
  locale,
  t,
  subjectId,
  topicIds,
  subject,
  ndlaFilm,
}: Props) => {
  const { name: subjectName } = subject;

  const metaDescription = subject.subjectpage?.metaDescription;
  const about = subject.subjectpage?.about;

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

  function renderCompetenceGoals(
    subject: GQLSubjectContainer_SubjectFragment,
    locale: LocaleType,
  ):
    | ((inp: {
        Dialog: ComponentType;
        dialogProps: { isOpen: boolean; onClose: () => void };
      }) => ReactNode)
    | null {
    // Don't show competence goals for topics or articles without grepCodes
    if (subject.grepCodes?.length) {
      return ({
        Dialog,
        dialogProps,
      }: {
        Dialog: ComponentType;
        dialogProps: { isOpen: boolean; onClose: () => void };
      }) => (
        <CompetenceGoals
          codes={subject.grepCodes}
          subjectId={subject.id}
          language={locale}
          wrapperComponent={Dialog}
          wrapperComponentProps={dialogProps}
        />
      );
    }
    return null;
  }

  const headerRef = useRef<HTMLDivElement>(null);
  const topicRefs = topicIds.map(_ => createRef<HTMLDivElement>());

  const handleNav = (e: MouseEvent<HTMLElement>, item: BreadcrumbItem) => {
    e.preventDefault();
    const { typename, index } = item;
    if (typename === 'Subjecttype' || typename === 'Subject') {
      setCurrentLevel(typename);
      scrollToRef(headerRef);
    } else {
      if (index !== undefined) {
        setCurrentLevel(index);
        const refToScroll = topicRefs[index];
        if (refToScroll) scrollToRef(refToScroll);
      }
    }
  };

  const onClickTopics = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const path = parseAndMatchUrl(e.currentTarget?.href, true);
    history.push({ pathname: path?.url });
  };

  // show/hide breadcrumb based on intersection
  const [containerRef, { entry }] = useIntersectionObserver({
    root: null,
    rootMargin: '-275px',
  });
  const showBreadCrumb = entry && entry.isIntersecting;
  const moveBannerUp = !topicIds?.length;

  const topicPath = topicIds?.map(t =>
    subject.allTopics?.find(topic => topic.id === t),
  );

  const socialMediaMetadata = {
    title:
      topicPath?.[topicPath.length - 1]?.name || about?.title || subject.name,
    description:
      topicPath?.[topicPath.length - 1]?.meta?.metaDescription ||
      subject.subjectpage?.metaDescription,
    image:
      topicPath?.[topicPath.length - 1]?.meta?.metaImage ||
      about?.visualElement,
  };

  const topicsOnPage =
    (topicIds.length > 0
      ? subject.topics?.filter(topic => topicIds.includes(topic.id))
      : subject.topics) || [];

  const supportedLanguages =
    topicsOnPage[topicsOnPage.length - 1]?.supportedLanguages;

  const nonRegularSubjectMessage = getSubjectCategoryMessage(
    subject.metadata.customFields['subjectCategory'],
    t,
  );

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
            <SocialMediaMetadata
              title={socialMediaMetadata.title}
              description={socialMediaMetadata.description}
              imageUrl={socialMediaMetadata.image?.url}
              trackableContent={{ supportedLanguages }}
            />
            <div ref={headerRef}>
              <ArticleHeaderWrapper
                competenceGoals={renderCompetenceGoals(subject, locale)}>
                <NavigationHeading
                  subHeading={subjectNames.subHeading}
                  invertedStyle={ndlaFilm}>
                  {subjectNames.longName}
                </NavigationHeading>
              </ArticleHeaderWrapper>
            </div>
            {nonRegularSubjectMessage && (
              <MessageBox>{nonRegularSubjectMessage}</MessageBox>
            )}
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
          image={subject.subjectpage?.banner.desktopUrl || ''}
          negativeTopMargin={moveBannerUp}
        />
      )}
      {/* {false && subject.subjectpage?.about && (
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
      )} */}
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

SubjectContainer.getDocumentTitle = ({ t, subject }: Props): string => {
  return htmlTitle(subject.name, [t('htmlTitles.titleTemplate')]);
};

SubjectContainer.willTrackPageView = (
  trackPageView: (p: Props) => void,
  currentProps: Props,
) => {
  const { subject, loading, topicIds } = currentProps;
  if (!loading && (subject.topics?.length ?? 0) > 0 && topicIds?.length === 0) {
    trackPageView(currentProps);
  }
};

SubjectContainer.getDimensions = (props: Props) => {
  const { subject, locale, topicIds, user } = props;
  const topicPath = topicIds.map(t =>
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

export const subjectContainerFragments = {
  subject: gql`
    fragment SubjectContainer_Subject on Subject {
      metadata {
        customFields
      }
      grepCodes
      topics {
        id
        supportedLanguages
      }
      allTopics {
        id
        name
        meta {
          metaDescription
          metaImage {
            url
          }
        }
      }
      subjectpage {
        metaDescription
        about {
          title
          visualElement {
            url
          }
        }
        banner {
          desktopUrl
        }
      }
      ...SubjectPageContent_Subject
    }
    ${SubjectPageContent.fragments.subject}
  `,
};

export default withTranslation()(withRouter(withTracker(SubjectContainer)));
