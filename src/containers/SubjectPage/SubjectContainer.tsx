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
import { Helmet } from 'react-helmet-async';
import {
  constants,
  ArticleHeaderWrapper,
  OneColumn,
  SubjectBanner,
  LayoutItem,
  NavigationHeading,
  Breadcrumblist,
  MessageBox,
  FeideUserApiType,
} from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
import { useIntersectionObserver } from '@ndla/hooks';
import {
  withTranslation,
  TFunction,
  CustomWithTranslation,
} from 'react-i18next';
import SubjectPageContent from './components/SubjectPageContent';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { scrollToRef } from './subjectPageHelpers';
import CompetenceGoals from '../../components/CompetenceGoals';
import { getAllDimensions } from '../../util/trackingUtil';
import { htmlTitle } from '../../util/titleHelper';
import { BreadcrumbItem } from '../../interfaces';
import { GQLSubjectContainer_SubjectFragment } from '../../graphqlTypes';
import {
  SKIP_TO_CONTENT_ID,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE,
} from '../../constants';
import { useIsNdlaFilm } from '../../routeHelpers';

type Props = {
  subjectId: string;
  topicIds: string[];
  subject: GQLSubjectContainer_SubjectFragment;
  loading?: boolean;
  user?: FeideUserApiType;
} & CustomWithTranslation;

const getSubjectCategoryMessage = (
  subjectCategory: string | undefined,
  t: TFunction,
): string | undefined => {
  if (
    !subjectCategory ||
    subjectCategory === constants.subjectCategories.ACTIVE_SUBJECTS
  ) {
    return undefined;
  } else if (subjectCategory === constants.subjectCategories.BETA_SUBJECTS) {
    return t('messageBoxInfo.subjectFuture');
  } else if (subjectCategory === constants.subjectCategories.ARCHIVE_SUBJECTS) {
    return t('messageBoxInfo.subjectOutdated');
  } else {
    return undefined;
  }
};

const getSubjectTypeMessage = (
  subjectType: string | undefined,
  t: TFunction,
): string | undefined => {
  if (!subjectType || subjectType === constants.subjectTypes.SUBJECT) {
    return undefined;
  } else if (subjectType === constants.subjectTypes.RESOURCE_COLLECTION) {
    return t('messageBoxInfo.resources');
  } else if (subjectType === constants.subjectTypes.BETA_SUBJECT) {
    return t('messageBoxInfo.subjectBeta');
  } else {
    return undefined;
  }
};

const SubjectContainer = ({ t, subjectId, topicIds, subject }: Props) => {
  const ndlaFilm = useIsNdlaFilm();
  const containerRef = useRef<HTMLDivElement>(null);
  const [competenceGoalsLoading, setCompetenceGoalsLoading] = useState(true);
  const about = subject.subjectpage?.about;

  const [currentLevel, setCurrentLevel] = useState<number | string | undefined>(
    0,
  );
  const [breadCrumbList, setBreadCrumbList] = useState<BreadcrumbItem[]>([]);

  const breadCrumbs: BreadcrumbItem[] = [
    {
      id: subjectId,
      label: subject.name,
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
          setCompetenceGoalsLoading={setCompetenceGoalsLoading}
          codes={subject.grepCodes}
          subjectId={subject.id}
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

  // show/hide breadcrumb based on intersection
  const { entry } = useIntersectionObserver({
    target: containerRef.current,
    rootMargin: '-275px',
  });
  const showBreadCrumb = entry && entry.isIntersecting;
  const moveBannerUp = !topicIds?.length;

  const topicPath = topicIds?.map(t =>
    subject.allTopics?.find(topic => topic.id === t),
  );

  const topicTitle = topicPath?.[topicPath.length - 1]?.name;
  const subjectTitle = subject.name;
  const title = [topicTitle, subjectTitle].filter(e => !!e).join(' - ');
  const socialMediaMetadata = {
    title,
    description:
      topicPath?.[topicPath.length - 1]?.meta?.metaDescription ||
      subject.subjectpage?.metaDescription,
    image:
      topicPath?.[topicPath.length - 1]?.meta?.metaImage ||
      about?.visualElement,
  };

  const pageTitle = htmlTitle(socialMediaMetadata.title, [
    t('htmlTitles.titleTemplate'),
  ]);

  const topicsOnPage =
    (topicIds.length > 0
      ? subject.topics?.filter(topic => topicIds.includes(topic.id))
      : subject.topics) || [];

  const supportedLanguages =
    topicsOnPage[topicsOnPage.length - 1]?.supportedLanguages;

  const nonRegularSubjectMessage = getSubjectCategoryMessage(
    subject.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY],
    t,
  );

  const nonRegularSubjectTypeMessage = getSubjectTypeMessage(
    subject.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE],
    t,
  );

  return (
    <main>
      <Helmet>
        <title>{pageTitle}</title>
        {subject?.metadata.customFields?.[
          TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY
        ] === constants.subjectCategories.ARCHIVE_SUBJECTS && (
          <meta name="robots" content="noindex, nofollow" />
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
                competenceGoalsLoading={competenceGoalsLoading}
                competenceGoals={renderCompetenceGoals(subject)}>
                <NavigationHeading
                  headingId={
                    topicIds.length === 0 ? SKIP_TO_CONTENT_ID : undefined
                  }
                  invertedStyle={ndlaFilm}>
                  {subject.name}
                </NavigationHeading>
              </ArticleHeaderWrapper>
            </div>
            {!ndlaFilm && nonRegularSubjectMessage && (
              <MessageBox>{nonRegularSubjectMessage}</MessageBox>
            )}
            {!ndlaFilm && nonRegularSubjectTypeMessage && (
              <MessageBox>{nonRegularSubjectTypeMessage}</MessageBox>
            )}
            <SubjectPageContent
              subject={subject}
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
      <OneColumn wide>
        <Breadcrumblist
          items={breadCrumbs}
          onNav={handleNav}
          invertedStyle={ndlaFilm}
          isVisible={showBreadCrumb}
        />
      </OneColumn>
    </main>
  );
};

SubjectContainer.getDocumentTitle = ({ t, subject }: Props): string => {
  return htmlTitle(subject?.name, [t('htmlTitles.titleTemplate')]);
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
  const { subject, topicIds, user } = props;
  const topicPath = topicIds.map(t =>
    subject.allTopics?.find(topic => topic.id === t),
  );

  return getAllDimensions({
    subject,
    topicPath,
    filter: subject.name,
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

export default withTranslation()(withTracker(SubjectContainer));
