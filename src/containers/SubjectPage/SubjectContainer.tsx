/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useState, createRef, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  constants,
  ArticleHeaderWrapper,
  OneColumn,
  SubjectBanner,
  LayoutItem,
  MessageBox,
  SimpleBreadcrumbItem,
  HomeBreadcrumb,
} from '@ndla/ui';
import { Heading } from '@ndla/typography';
import { useTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import SubjectPageContent from './components/SubjectPageContent';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import CompetenceGoals from '../../components/CompetenceGoals';
import { getAllDimensions } from '../../util/trackingUtil';
import { htmlTitle } from '../../util/titleHelper';
import { GQLSubjectContainer_SubjectFragment } from '../../graphqlTypes';
import {
  SKIP_TO_CONTENT_ID,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE,
} from '../../constants';
import { removeUrn, useIsNdlaFilm } from '../../routeHelpers';
import { AuthContext } from '../../components/AuthenticationContext';

type Props = {
  topicIds: string[];
  subject: GQLSubjectContainer_SubjectFragment;
  loading?: boolean;
};

const BreadcrumbWrapper = styled.div`
  margin-top: ${spacing.mediumlarge};
`;

const StyledHeading = styled(Heading)`
  &[data-inverted='true'] {
    color: ${colors.white};
  }
`;

const getSubjectCategoryMessage = (
  subjectCategory: string | undefined,
  t: TFunction,
): string | undefined => {
  if (
    !subjectCategory ||
    subjectCategory === constants.subjectCategories.ACTIVE_SUBJECTS
  ) {
    return undefined;
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

const SubjectContainer = ({ topicIds, subject, loading }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const ndlaFilm = useIsNdlaFilm();
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const about = subject.subjectpage?.about;

  useEffect(() => {
    if (!authContextLoaded) return;
    if (!loading && !!subject.topics?.length && topicIds.length === 0) {
      const topicPath = topicIds.map(
        (id) => subject.allTopics?.find((t) => t.id === id),
      );
      const dimensions = getAllDimensions({
        subject,
        topicPath,
        filter: subject.name,
        user,
      });
      trackPageView({
        dimensions,
        title: htmlTitle(subject.name, [t('htmlTitles.titleTemplate')]),
      });
    }
  }, [authContextLoaded, loading, subject, t, topicIds, trackPageView, user]);

  const [topicCrumbs, setTopicCrumbs] = useState<SimpleBreadcrumbItem[]>([]);

  useEffect(() => {
    setTopicCrumbs((crumbs) => crumbs.slice(0, topicIds.length));
  }, [topicIds.length]);

  const breadCrumbs: SimpleBreadcrumbItem[] = [
    {
      name: t('breadcrumb.toFrontpage'),
      to: '/',
    },
    {
      to: `${removeUrn(subject.id)}`,
      name: subject.name,
    },
    ...topicCrumbs,
  ].reduce<SimpleBreadcrumbItem[]>((crumbs, crumb) => {
    crumbs.push({
      name: crumb.name,
      to: `${crumbs[crumbs.length - 1]?.to ?? ''}${crumb.to}`,
    });

    return crumbs;
  }, []);

  const topicRefs = topicIds.map((_) => createRef<HTMLDivElement>());

  const moveBannerUp = !topicIds?.length;

  const topicPath = topicIds?.map(
    (t) => subject.allTopics?.find((topic) => topic.id === t),
  );

  const topicTitle = topicPath?.[topicPath.length - 1]?.name;
  const subjectTitle = subject.name;
  const title = [topicTitle, subjectTitle].filter((e) => !!e).join(' - ');
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
      ? subject.topics?.filter((topic) => topicIds.includes(topic.id))
      : subject.topics) || [];

  const supportedLanguages =
    topicsOnPage[topicsOnPage.length - 1]?.supportedLanguages;

  const customFields = subject?.metadata.customFields || {};

  const nonRegularSubjectMessage = getSubjectCategoryMessage(
    customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY],
    t,
  );

  const nonRegularSubjectTypeMessage = getSubjectTypeMessage(
    customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE],
    t,
  );

  return (
    <main>
      <Helmet>
        <title>{pageTitle}</title>
        {(customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] ===
          constants.subjectCategories.ARCHIVE_SUBJECTS ||
          customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] ===
            'true') && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      <OneColumn>
        <LayoutItem layout="extend">
          <SocialMediaMetadata
            title={socialMediaMetadata.title}
            description={socialMediaMetadata.description}
            imageUrl={socialMediaMetadata.image?.url}
            trackableContent={{ supportedLanguages }}
          />
          <ArticleHeaderWrapper
            competenceGoals={
              subject.grepCodes?.length ? (
                <CompetenceGoals
                  codes={subject.grepCodes}
                  subjectId={subject.id}
                />
              ) : undefined
            }
          >
            <BreadcrumbWrapper>
              <HomeBreadcrumb light={ndlaFilm} items={breadCrumbs} />
            </BreadcrumbWrapper>
            <StyledHeading
              element="h1"
              margin="xlarge"
              headingStyle="h1-resource"
              data-inverted={ndlaFilm}
              id={topicIds.length === 0 ? SKIP_TO_CONTENT_ID : undefined}
              tabIndex={-1}
            >
              {subject.name}
            </StyledHeading>
          </ArticleHeaderWrapper>
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
            setBreadCrumb={setTopicCrumbs}
          />
        </LayoutItem>
      </OneColumn>
      {subject.subjectpage?.banner && (
        <SubjectBanner
          image={subject.subjectpage?.banner.desktopUrl || ''}
          negativeTopMargin={moveBannerUp}
        />
      )}
    </main>
  );
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

export default SubjectContainer;
