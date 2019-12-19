/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, Fragment } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import PropTypes from 'prop-types';
import {
  FrontpageHeader,
  FrontpageFilm,
  OneColumn,
  FrontpageSearch,
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { Query } from 'react-apollo';
import debounce from 'lodash.debounce';
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
import handleError from '../../util/handleError';
import { frontpageSearchQuery } from '../../queries';

import { topicsNotInNDLA } from '../../util/topicsHelper';
import { mapSearchToFrontPageStructure } from '../../util/searchHelpers';
import { toSearch } from '../../routeHelpers';
import { getLocaleUrls } from '../../util/localeHelpers';
import { LocationShape } from '../../shapes';
import BlogPosts from './BlogPosts';
import { searchResultToLinkProps } from '../SearchPage/searchHelpers';

const debounceCall = debounce(fn => fn(), 300);
const WelcomePage = ({ t, data, loading, locale, history, location }) => {
  const [query, setQuery] = useState('');
  const [delayedSearchQuery, setDelayedSearchQuery] = useState('');
  const [inputHasFocus, setInputHasFocus] = useState(false);
  const onSearchFieldChange = query => {
    setQuery(query);
    debounceCall(() => setDelayedSearchQuery(query));
  };

  const allResultsUrl = toSearch(`?query=${query}`);

  const onSearch = evt => {
    evt.preventDefault();
    history.push(allResultsUrl);
  };

  const renderInfoText = () => (
    <span>
      {topicsNotInNDLA.map((topic, index) => (
        <Fragment key={topic}>
          {index === topicsNotInNDLA.length - 1 &&
            `${t('welcomePage.topicsConjunction')} `}
          <strong key={topic}>
            {topic}
            {index < topicsNotInNDLA.length - 2 && ','}{' '}
          </strong>
        </Fragment>
      ))}
      {t('welcomePage.topicsNotAvailableFromSearch')}
    </span>
  );

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

  const headerMessages = {
    searchFieldTitle: t('welcomePage.heading.messages.searchFieldTitle'),
    menuButton: t('welcomePage.heading.messages.menuButton'),
  };

  const frontPageSubjects = subjects.length > 0 && (
    <FrontpageSubjects
      subjects={subjects}
      categories={categories}
      locale={locale}
    />
  );

  const infoText =
    topicsNotInNDLA.length > 0 && delayedSearchQuery.length > 2
      ? renderInfoText()
      : '';
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
        <Query
          fetchPolicy="no-cache"
          variables={{
            query: delayedSearchQuery,
          }}
          ssr={false}
          skip={delayedSearchQuery.length <= 2}
          query={frontpageSearchQuery}>
          {({ data, loading, error }) => {
            if (error) {
              handleError(error);
              return `Error: ${error.message}`;
            }
            return (
              <FrontpageSearch
                inputHasFocus={inputHasFocus}
                onInputBlur={() => setInputHasFocus(false)}
                messages={headerMessages}
                searchFieldValue={query}
                onSearch={onSearch}
                onSearchFieldChange={onSearchFieldChange}
                searchFieldPlaceholder={t(
                  'welcomePage.heading.searchFieldPlaceholder',
                )}
                searchResult={
                  delayedSearchQuery.length > 2 &&
                  mapSearchToFrontPageStructure(
                    data,
                    t,
                    delayedSearchQuery,
                    locale,
                  )
                }
                infoText={infoText}
                onSearchInputFocus={() => setInputHasFocus(true)}
                allResultUrl={allResultsUrl}
                loading={loading}
                resourceToLinkProps={searchResultToLinkProps}
                history={history}
              />
            );
          }}
        </Query>
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
