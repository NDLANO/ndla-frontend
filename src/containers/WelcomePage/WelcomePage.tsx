/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useEffect } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import {
  FrontpageHeader,
  FrontpageFilm,
  OneColumn,
  FrontpageToolbox,
  FrontpageMultidisciplinarySubject,
  BannerCard,
} from '@ndla/ui';
import { spacing, utils } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { gql, useLazyQuery } from '@apollo/client';

import WelcomePageInfo from './WelcomePageInfo';
import FrontpageSubjects from './FrontpageSubjects';
import {
  FILM_PAGE_PATH,
  SKIP_TO_CONTENT_ID,
  UKR_PAGE_PATH,
  MULTIDISCIPLINARY_SUBJECT_ID,
  TOOLBOX_STUDENT_SUBJECT_ID,
  TOOLBOX_TEACHER_SUBJECT_ID,
} from '../../constants';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';
import BlogPosts from './BlogPosts';
import WelcomePageSearch from './WelcomePageSearch';
import { toSubject, toTopic } from '../../routeHelpers';
import { LocaleType, TopicType } from '../../interfaces';
import { GQLSubjectsQuery } from '../../graphqlTypes';
import { multidisciplinaryTopics } from '../../data/subjects';

const getMultidisciplinaryTopics = (locale: LocaleType) => {
  return multidisciplinaryTopics.map((topic: TopicType) => {
    return {
      id: topic.id,
      title: topic.name?.[locale] ?? '',
      url: toTopic(MULTIDISCIPLINARY_SUBJECT_ID, topic.id ?? ''),
    };
  });
};

const HiddenHeading = styled.h1`
  ${utils.visuallyHidden};
`;

const BannerCardWrapper = styled.div`
  padding-bottom: ${spacing.large};
`;

const frontpageSubjectsQuery = gql`
  query frontpageSubjects {
    subjects(filterVisible: true) {
      id
      name
      path
      metadata {
        customFields
      }
    }
  }
`;

const WelcomePage = () => {
  const { t, i18n } = useTranslation();
  const [fetchData, { data }] = useLazyQuery<GQLSubjectsQuery>(
    frontpageSubjectsQuery,
  );

  useEffect(() => {
    const getData = () => {
      fetchData();
    };
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const googleSearchJSONLd = () => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: 'https://ndla.no/',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://ndla.no/search?query={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    };
    return JSON.stringify(data);
  };

  return (
    <>
      <HiddenHeading>{t('welcomePage.heading.heading')}</HiddenHeading>
      <HelmetWithTracker title={t('htmlTitles.welcomePage')}>
        <script type="application/ld+json">{googleSearchJSONLd()}</script>
      </HelmetWithTracker>
      <SocialMediaMetadata
        type="website"
        title={t('welcomePage.heading.heading')}
        description={t('meta.description')}
        imageUrl={`${config.ndlaFrontendDomain}/static/logo.png`}
      >
        <meta name="keywords" content={t('meta.keywords')} />
      </SocialMediaMetadata>
      <FrontpageHeader locale={i18n.language} showHeader={true}>
        <WelcomePageSearch />
      </FrontpageHeader>
      <main>
        <OneColumn extraPadding>
          <BannerCardWrapper>
            <BannerCard
              link={UKR_PAGE_PATH}
              title={{
                title: 'Lær om det norske samfunnet - på ukrainsk',
                lang: 'nb',
              }}
              content={{
                content: 'Дізнайтеся про норвезьке суспільство – українською',
                lang: 'uk',
              }}
              linkText={{
                text: 'Learn about Norwegian society - in Ukrainian',
                lang: 'en',
              }}
              image={{
                altText: '',
                imageSrc: '/static/flag_of_ukraine.svg',
              }}
            />
          </BannerCardWrapper>
          <div data-testid="category-list" id={SKIP_TO_CONTENT_ID}>
            <FrontpageSubjects
              locale={i18n.language}
              subjects={data?.subjects}
            />
          </div>
        </OneColumn>
        <OneColumn wide>
          <FrontpageMultidisciplinarySubject
            headingLevel="h2"
            url={toSubject(MULTIDISCIPLINARY_SUBJECT_ID)}
            topics={getMultidisciplinaryTopics(i18n.language)}
          />
          <FrontpageToolbox
            headingLevel="h2"
            urlStudents={toSubject(TOOLBOX_STUDENT_SUBJECT_ID)}
            urlTeachers={toSubject(TOOLBOX_TEACHER_SUBJECT_ID)}
          />
          <BlogPosts locale={i18n.language} />
          <FrontpageFilm
            imageUrl="/static/film_illustrasjon.svg"
            url={FILM_PAGE_PATH}
          />
          <WelcomePageInfo />
        </OneColumn>
      </main>
    </>
  );
};

export default WelcomePage;
