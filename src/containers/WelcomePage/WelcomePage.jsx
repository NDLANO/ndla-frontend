/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
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
import { toSubject } from '../../routeHelpers';
import { getSubjectById } from '../../data/subjects';

const getUrlFromSubjectId = subjectId => {
  const subject = getSubjectById(subjectId);
  const filters = subject.filters ? subject.filters.join(',') : '';
  return toSubject(subject.subjectId, filters);
};

const getMultidisciplinarySubjects = locale => {
  const subjectIds = [
    'common_subject_57',
    'common_subject_58',
    'common_subject_59',
  ];
  return subjectIds.map(subjectId => {
    const subject = getSubjectById(subjectId);
    return {
      id: subject.id,
      title: subject.name[locale],
      url: getUrlFromSubjectId(subjectId),
    };
  });
};

const MULTIDISCIPLINARY_SUBJECT_ID = 'common_subject_60';
const TOOLBOX_SUBJECT_ID = 'common_subject_61';

const WelcomePage = ({ t, locale, history, location }) => {
  const headerLinks = [
    {
      to: 'https://om.ndla.no',
      text: t('welcomePage.heading.links.aboutNDLA'),
    },
  ];

  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.welcomePage')} />
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
          <FrontpageToolbox url={getUrlFromSubjectId(TOOLBOX_SUBJECT_ID)} />
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
