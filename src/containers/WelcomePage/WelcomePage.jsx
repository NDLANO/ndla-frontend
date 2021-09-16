/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import PropTypes from 'prop-types';
import {
  FrontpageHeader,
  FrontpageFilm,
  OneColumn,
  FrontpageToolbox,
  FrontpageMultidisciplinarySubject,
} from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';

import WelcomePageInfo from './WelcomePageInfo';
import FrontpageSubjects from './FrontpageSubjects';
import {
  FILM_PAGE_PATH,
  MULTIDISCIPLINARY_SUBJECT_ID,
  TOOLBOX_STUDENT_SUBJECT_ID,
  TOOLBOX_TEACHER_SUBJECT_ID,
} from '../../constants';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';
import { getLocaleUrls } from '../../util/localeHelpers';
import { LocationShape } from '../../shapes';
import BlogPosts from './BlogPosts';
import WelcomePageSearch from './WelcomePageSearch';
import { toSubject, toTopic } from '../../routeHelpers';
import { getSubjectById } from '../../data/subjects';
import { subjectsQuery } from '../../queries';
import { GQLSubjectsQueryData } from '../../graphqlTypes'

const getUrlFromSubjectId = subjectId => {
  const subject = getSubjectById(subjectId);
  return toSubject(subject.id);
};

const getMultidisciplinaryTopics = locale => {
  const topicIds = [
    'urn:topic:3cdf9349-4593-498c-a899-9310133a4788',
    'urn:topic:077a5e01-6bb8-4c0b-b1d4-94b683d91803',
    'urn:topic:a2f5aaa0-ab52-49d5-aabf-e7ffeac47fa2',
  ];

  const baseSubject = getSubjectById(MULTIDISCIPLINARY_SUBJECT_ID);

  return topicIds.map(topicId => {
    const topic = getSubjectById(topicId);
    return {
      id: topic.id,
      title: topic.name[locale],
      url: toTopic(baseSubject.id, null, topic.topicId),
    };
  });
};

const WelcomePage = ({ locale, history, location }) => {
  const { t } = useTranslation();

  useEffect(() => {
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [fetchData, { data }] = useLazyQuery<GQLSubjectsQueryData>(
    subjectsQuery,
  );

  const getData = () => {
    fetchData();
  };

  const headerLinks = [
    {
      to: 'https://om.ndla.no',
      text: t('welcomePage.heading.links.aboutNDLA'),
    },
  ];

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
        image={{ src: `${config.ndlaFrontendDomain}/static/logo.png` }}>
        <meta name="keywords" content={t('meta.keywords')} />
      </SocialMediaMetadata>
      <FrontpageHeader
        links={headerLinks}
        locale={locale}
        languageOptions={getLocaleUrls(locale, location)}>
        <WelcomePageSearch history={history} locale={locale} />
      </FrontpageHeader>
      <main>
        <OneColumn extraPadding>
          <div data-testid="category-list">
            <FrontpageSubjects locale={locale} subjects={data?.subjects} />
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
            messages={{
              header: t('welcomePage.film.header'),
              linkLabel: t('welcomePage.film.linkLabel'),
              text: t('welcomePage.film.text'),
            }}
          />
          <WelcomePageInfo />
        </OneColumn>
      </main>
    </>
  );
};

WelcomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: LocationShape,
  locale: PropTypes.string.isRequired,
};

export default WelcomePage;
