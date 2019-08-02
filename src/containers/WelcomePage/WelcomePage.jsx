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
import queryString from 'query-string';
import { FrontpageHeader, FrontpageFilm, OneColumn } from '@ndla/ui';
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
import { frontpageSearch } from '../../queries';
import { FRONTPAGE_CATEGORIES } from '../../constants';
import { topicsNotInNDLA } from '../../util/topicsHelper';

const debounceCall = debounce(fn => fn(), 250);
const WelcomePage = ({ t, data, loading, locale, history }) => {
  const [query, setQuery] = useState('');
  const [delayedSearchQuery, setDelayedSearchQuery] = useState('');
  const [inputHasFocus, setInputHasFocus] = useState(false);

  const onSearchFieldChange = query => {
    setQuery(query);
    debounceCall(() => setDelayedSearchQuery(query));
  };

  const onSearch = evt => {
    evt.preventDefault();
    history.push({
      pathname: '/search',
      search: queryString.stringify({
        query,
        page: 1,
      }),
    });
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
  const searchParams = {
    query: delayedSearchQuery.length > 2 ? delayedSearchQuery : null,
  };

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
      <Query
        fetchPolicy="no-cache"
        variables={searchParams}
        ssr={false}
        query={frontpageSearch}>
        {({ data, error }) => {
          if (error) {
            handleError(error);
            return `Error: ${error.message}`;
          }
          return (
            <FrontpageHeader
              locale={locale}
              heading={t('welcomePage.heading.heading')}
              menuSubject={frontPageSubjects}
              messages={headerMessages}
              links={headerLinks}
              hideSearch={false}
              searchFieldValue={query}
              onSearch={onSearch}
              onSearchFieldChange={onSearchFieldChange}
              searchFieldPlaceholder={t(
                'welcomePage.heading.searchFieldPlaceholder',
              )}
              searchResult={
                query.length > 2
                  ? mapSearchToFrontPageStructure(data || [], t, query, locale)
                  : []
              }
              infoText={infoText}
              onSearchInputFocus={() => setInputHasFocus(true)}
              onSearchDeactiveFocusTrap={() => setInputHasFocus(false)}
              inputHasFocus={inputHasFocus}
              allResultUrl={`search?query=${query}`}
            />
          );
        }}
      </Query>
      <main>
        <div data-testid="category-list">{frontPageSubjects}</div>
        <OneColumn>
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

function mapSearchToFrontPageStructure(data, t, query, locale) {
  query = query.trim().toLowerCase();
  const localeString = locale ? `/${locale}` : '';
  // figure out if there are match in fronpage categories
  const subjects = {
    title: t('searchPage.label.subjects'),
    contentType: 'results-frontpage',
    resources: FRONTPAGE_CATEGORIES.categories.reduce((ac, cu) => {
      const foundInSubjects = cu.subjects.filter(subject =>
        subject.name.toLowerCase().includes(query),
      );
      return foundInSubjects.length > 0
        ? foundInSubjects
            .map(subject => ({
              id: subject.id,
              path: subject.id
                ? `/subjects/${subject.id.replace('urn:', '')}/`
                : `${localeString}/node/${subject.nodeId}/`,
              boldName: `${cu.name.charAt(0).toUpperCase()}${cu.name.slice(
                1,
              )}:`,
              name: subject.name,
            }))
            .concat(ac)
        : ac;
    }, []),
  };

  if (
    subjects.resources.length === 0 &&
    (!data.search ||
      (data.search && !data.search.results) ||
      (data.search && data.search.results && data.search.results.length === 0))
  ) {
    return [];
  }
  const result = data.search && data.search.results ? data.search.results : [];
  const topics = {
    title: `${t('subjectPage.tabs.topics')}:`,
    contentType: 'results-frontpage',
    resources: [],
  };
  const resource = {
    title: `${t('resource.label')}:`,
    contentType: 'results-frontpage',
    resources: [],
    totalCount: data.search.totalCount,
  };
  // distribute and group the result in right section
  result.forEach(resultData => {
    if (resultData && resultData.contexts && resultData.contexts.length !== 0) {
      resultData.contexts.forEach(ctx => {
        if (!ctx.id) {
          return false;
        }
        const resultItem = {
          id: `${resultData.id}-${ctx.id}`,
          path: `/subjects${ctx.path}`,
          boldName: `${ctx.subject}:`,
          name: resultData.title,
          subName:
            ctx.resourceTypes[0] && ctx.resourceTypes[0].name
              ? ctx.resourceTypes.map(type => type.name).join(', ') // TODO: translate
              : '',
        };
        if (
          ctx.id.includes('topic') &&
          topics.resources.filter(obj => obj.path === resultItem.path)
            .length === 0
        ) {
          topics.resources.push(resultItem);
        } else if (
          resource.resources.filter(obj => obj.path === resultItem.path)
            .length === 0
        ) {
          resource.resources.push(resultItem);
        }
      });
    }
  });
  const returnArray = [];
  // add groups into return array if there are any resources
  if (subjects.resources.length !== 0) {
    returnArray.push(subjects);
  }
  if (topics.resources.length !== 0) {
    returnArray.push(topics);
  }
  if (resource.resources.length !== 0) {
    returnArray.push(resource);
  }
  return returnArray;
}

WelcomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
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
