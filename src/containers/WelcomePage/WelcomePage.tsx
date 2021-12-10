/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import {
  FrontpageHeader,
  FrontpageFilm,
  OneColumn,
  FrontpageToolbox,
  FrontpageMultidisciplinarySubject,
} from '@ndla/ui';
import { useTranslation } from 'react-i18next';

import WelcomePageInfo from './WelcomePageInfo';
import FrontpageSubjects from './FrontpageSubjects';
import { FILM_PAGE_PATH } from '../../constants';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';
import BlogPosts from './BlogPosts';
import WelcomePageSearch from './WelcomePageSearch';
import { toSubject, toTopic } from '../../routeHelpers';
import { getSubjectById } from '../../data/subjects';
import { LocaleType } from '../../interfaces';

const getUrlFromSubjectId = (subjectId: string) => {
  const subject = getSubjectById(subjectId);
  return toSubject(subject!.id);
};

const MULTIDISCIPLINARY_SUBJECT_ID =
  'urn:subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7';
const TOOLBOX_TEACHER_SUBJECT_ID =
  'urn:subject:1:9bb7b427-3f5b-4c45-9719-efc509f3d9cc';
const TOOLBOX_STUDENT_SUBJECT_ID =
  'urn:subject:1:54b1727c-2d91-4512-901c-8434e13339b4';

const getMultidisciplinaryTopics = (locale: LocaleType) => {
  const topicIds = [
    'urn:topic:3cdf9349-4593-498c-a899-9310133a4788',
    'urn:topic:077a5e01-6bb8-4c0b-b1d4-94b683d91803',
    'urn:topic:a2f5aaa0-ab52-49d5-aabf-e7ffeac47fa2',
  ];

  const baseSubject = getSubjectById(MULTIDISCIPLINARY_SUBJECT_ID)!;

  return topicIds.map(topicId => {
    const topic = getSubjectById(topicId)!;
    return {
      id: topic.id,
      title: topic.name![locale],
      url: toTopic(baseSubject.id, topic.topicId!),
    };
  });
};

interface Props {
  locale: LocaleType;
}

const WelcomePage = ({ locale }: Props) => {
  const { t } = useTranslation();

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
        locale={locale}
        image={{ url: `${config.ndlaFrontendDomain}/static/logo.png` }}>
        <meta name="keywords" content={t('meta.keywords')} />
      </SocialMediaMetadata>
      <FrontpageHeader locale={locale} showHeader={true}>
        <WelcomePageSearch />
      </FrontpageHeader>
      <main>
        <OneColumn extraPadding>
          <div data-testid="category-list">
            <FrontpageSubjects locale={locale} />
          </div>
        </OneColumn>
        <OneColumn wide>
          <FrontpageMultidisciplinarySubject
            url={getUrlFromSubjectId(MULTIDISCIPLINARY_SUBJECT_ID)}
            topics={getMultidisciplinaryTopics(locale)}
          />
          <FrontpageToolbox
            urlStudents={getUrlFromSubjectId(TOOLBOX_STUDENT_SUBJECT_ID)}
            urlTeachers={getUrlFromSubjectId(TOOLBOX_TEACHER_SUBJECT_ID)}
          />
          <BlogPosts locale={locale} />
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
