/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useContext } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import PropTypes from 'prop-types';
import {
  FrontpageHeader,
  FrontpageFilm,
  OneColumn,
  FrontpageToolbox,
  FrontpageMultidisciplinarySubject,
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';

import WelcomePageInfo from './WelcomePageInfo';
import FrontpageSubjects from './FrontpageSubjects';
import { FILM_PAGE_PATH } from '../../constants';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';

import { getLocaleUrls } from '../../util/localeHelpers';
import { LocationShape } from '../../shapes';
import BlogPosts from './BlogPosts';
import WelcomePageSearch from './WelcomePageSearch';
import { toSubject, toTopic } from '../../routeHelpers';
import { getSubjectById } from '../../data/subjects';
import { AuthContext } from '../../components/AuthenticationContext';

const getUrlFromSubjectId = subjectId => {
  const subject = getSubjectById(subjectId);
  return toSubject(subject.subjectId);
};

const MULTIDISCIPLINARY_SUBJECT_ID = 'common_subject_60';
const TOOLBOX_TEACHER_SUBJECT_ID = 'common_subject_61';
const TOOLBOX_STUDENT_SUBJECT_ID = 'common_subject_66';

const getMultidisciplinarySubjects = locale => {
  const subjectIds = [
    'multidisciplinary_subject_1',
    'multidisciplinary_subject_2',
    'multidisciplinary_subject_3',
  ];

  const baseSubject = getSubjectById(MULTIDISCIPLINARY_SUBJECT_ID);

  return subjectIds.map(subjectId => {
    const subject = getSubjectById(subjectId);
    return {
      id: subject.id,
      title: subject.name[locale],
      url: toTopic(baseSubject.subjectId, null, subject.topicId),
    };
  });
};

const WelcomePage = ({ t, locale, history, location }) => {
  const { authenticated } = useContext(AuthContext);

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
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.welcomePage')}>
        <script type="application/ld+json">{googleSearchJSONLd()}</script>
      </HelmetWithTracker>
      {authenticated ? (
        <a href="/logout">LOGOUT</a>
      ) : (
        <a href="/login">LOGIN</a>
      )}
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
            <FrontpageSubjects locale={locale} />
          </div>
        </OneColumn>
        <OneColumn wide>
          <FrontpageMultidisciplinarySubject
            url={getUrlFromSubjectId(MULTIDISCIPLINARY_SUBJECT_ID)}
            topics={getMultidisciplinarySubjects(locale)}
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
    </Fragment>
  );
};

WelcomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: LocationShape,
  locale: PropTypes.string.isRequired,
};

export default injectT(WelcomePage);
