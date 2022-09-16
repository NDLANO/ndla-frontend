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
import { spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';

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
import { subjectsQuery } from '../../queries';
import { GQLSubjectsQuery } from '../../graphqlTypes';
import { multidisciplinaryTopics } from '../../data/subjects.ts';

const getMultidisciplinaryTopics = (locale: LocaleType) => {
  return multidisciplinaryTopics.map((topic: TopicType) => {
    return {
      id: topic.id,
      title: topic.name?.[locale],
      url: toTopic(MULTIDISCIPLINARY_SUBJECT_ID, topic.topicId ?? ''),
    };
  });
};

const BannerCardWrapper = styled.div`
  padding-bottom: ${spacing.large};
`;

const WelcomePage = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [fetchData, { data }] = useLazyQuery<GQLSubjectsQuery>(subjectsQuery);

  const getData = () => {
    fetchData();
  };

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
      <HelmetWithTracker title={t('htmlTitles.welcomePage')}>
        <script type="application/ld+json">{googleSearchJSONLd()}</script>
      </HelmetWithTracker>
      <SocialMediaMetadata
        title={t('welcomePage.heading.heading')}
        description={t('meta.description')}
        imageUrl={`${config.ndlaFrontendDomain}/static/logo.png`}>
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
              title="Lær om det norske samfunnet - på ukrainsk"
              content="Дізнайтеся про норвезьке суспільство – українською"
              linkText="Learn about Norwegian society - in Ukrainian"
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
            url={toSubject(MULTIDISCIPLINARY_SUBJECT_ID)}
            topics={getMultidisciplinaryTopics(i18n.language)}
          />
          <FrontpageToolbox
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
