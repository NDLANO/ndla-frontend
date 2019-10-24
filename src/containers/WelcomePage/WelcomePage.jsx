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
import { FrontpageHeader, FrontpageFilm, OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import Spinner from '@ndla/ui/lib/Spinner';
import {
  GraphQLFrontpageShape,
  GraphQLSimpleSubjectShape,
} from '../../graphqlShapes';
import { frontpageQuery, subjectsQuery } from '../../queries';
import { runQueries } from '../../util/runQueries';
import WelcomePageInfo from './WelcomePageInfo';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import FrontpageSubjects from './FrontpageSubjects';
import { FILM_PAGE_PATH, ALLOWED_SUBJECTS } from '../../constants';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';

import { getLocaleUrls } from '../../util/localeHelpers';
import { LocationShape } from '../../shapes';
import BlogPosts from './BlogPosts';
import WelcomePageSearch from './WelcomePageSearch';

const WelcomePage = ({ t, data, loading, locale, history, location }) => {
  if (loading) {
    return <Spinner />;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  const { subjects = [] } = data;
  const frontpage = data && data.frontpage ? data.frontpage : {};
  const { categories = [] } = frontpage;
  const headerLinks = [
    {
      to: 'https://om.ndla.no',
      text: t('welcomePage.heading.links.aboutNDLA'),
    },
  ];

  const frontPageSubjects = subjects.length > 0 && (
    <FrontpageSubjects
      subjects={subjects}
      categories={categories}
      locale={locale}
    />
  );

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
        <div data-testid="category-list">{frontPageSubjects}</div>
        <OneColumn wide>
          <BlogPosts locale={locale} />
          <FrontpageFilm
            imageUrl="/static/film_illustrasjon.svg"
            url={
              ALLOWED_SUBJECTS.includes(
                FILM_PAGE_PATH.replace('/subjects/', 'urn:'),
              )
                ? FILM_PAGE_PATH
                : 'https://ndla.no/nb/film'
            }
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
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    frontpage: GraphQLFrontpageShape,
    subjects: PropTypes.arrayOf(GraphQLSimpleSubjectShape),
  }),
};

WelcomePage.getInitialProps = async ({ client }) => {
  return runQueries(client, [
    {
      query: frontpageQuery,
    },
    {
      query: subjectsQuery,
    },
  ]);
};

export default injectT(WelcomePage);
