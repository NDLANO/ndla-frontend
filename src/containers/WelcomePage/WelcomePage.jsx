/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  FrontpageHeader,
  FrontpageFilm,
  FrontpageSearchSection,
  OneColumn,
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { Query } from 'react-apollo';
import debounce from 'lodash.debounce';
import { GraphQLFrontpageShape } from '../../graphqlShapes';
import { frontpageQuery, subjectsQuery } from '../../queries';
import { runQueries } from '../../util/runQueries';
import WelcomePageInfo from './WelcomePageInfo';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import FrontpageSubjects from './FrontpageSubjects';
import { FILM_PAGE_PATH } from '../../constants';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';
import handleError from '../../util/handleError';
import { frontpageSearch } from '../../queries';
import {
  RESOURCE_TYPE_LEARNING_PATH,
  FRONTPAGE_CATEGORIES,
} from '../../constants';
import { topicsNotInNDLA } from '../../util/topicsHelper';

const debounceCall = debounce(fn => fn(), 250);
export class WelcomePage extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
      inputHasFocus: false,
      delayedSearchQuery: '',
    };
  }

  onSearchInputFocus = () => {
    this.setState({
      inputHasFocus: true,
    });
  };

  onSearchDeactiveFocusTrap = () => {
    this.setState({
      inputHasFocus: false,
    });
  };

  onSearchFieldChange = query => {
    this.setState({ query });
    debounceCall(() => this.setState({ delayedSearchQuery: query }));
  };

  onSearch = evt => {
    evt.preventDefault();
    const { history } = this.props;
    history.push({
      pathname: '/search',
      search: queryString.stringify({
        query: this.state.query,
        page: 1,
      }),
    });
  };

  static async getInitialProps({ client }) {
    return runQueries(client, [
      {
        query: frontpageQuery,
      },
      {
        query: subjectsQuery,
      },
    ]);
  }

  renderInfoText = t => (
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

  render() {
    const { t, data, loading, locale } = this.props;
    if (loading) {
      return null;
    }

    if (!data) {
      return <DefaultErrorMessage />;
    }

    const { subjects = [] } = data;
    const frontpage = data && data.frontpage ? data.frontpage : {};
    const { categories = [] } = frontpage;
    const { query, inputHasFocus, delayedSearchQuery } = this.state;
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
        ? this.renderInfoText(t)
        : '';
    return (
      <Fragment>
        <HelmetWithTracker title={t('htmlTitles.welcomePage')} />
        <SocialMediaMetadata
          title={t('welcomePage.heading.heading')}
          description={t('meta.description')}
          locale={locale}
          image={{ src: `${config.ndlaFrontendDomain}/static/logo.png` }}>
          <link
            rel="alternate"
            hrefLang="en"
            href={`${config.ndlaFrontendDomain}/en`}
          />
          <link
            rel="alternate"
            hrefLang="nb"
            href={`${config.ndlaFrontendDomain}/nb`}
          />
          <link
            rel="alternate"
            hrefLang="nn"
            href={`${config.ndlaFrontendDomain}/nn`}
          />
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
                onSearch={this.onSearch}
                onSearchFieldChange={this.onSearchFieldChange}
                searchFieldPlaceholder={t(
                  'welcomePage.heading.searchFieldPlaceholder',
                )}
                searchResult={
                  query.length > 2
                    ? mapSearchToFrontPageStructure(
                        data || [],
                        t,
                        query,
                        locale,
                      )
                    : []
                }
                infoText={infoText}
                onSearchInputFocus={this.onSearchInputFocus}
                onSearchDeactiveFocusTrap={this.onSearchDeactiveFocusTrap}
                inputHasFocus={inputHasFocus}
                allResultUrl={`search?query=${query}`}
              />
            );
          }}
        </Query>
        <main>
          <div data-testid="category-list">{frontPageSubjects}</div>
          <OneColumn>
            <FrontpageSearchSection
              heading={t('welcomePage.search')}
              searchFieldValue={query}
              onSearchFieldChange={this.onSearchFieldChange}
              onSearch={this.onSearch}
              hideSearch={false}
            />
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
  }
}

function mapSearchToFrontPageStructure(data, t, query, locale) {
  query = query.trim().toLowerCase();
  const localeString = locale ? `/${locale}` : '';
  // figure out if there are match in fronpage categories
  const subjects = {
    title: `${t('htmlTitles.subject')}:`,
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
  };
  // distribute and group the result in right section
  result.forEach(resultData => {
    if (resultData && resultData.contexts && resultData.contexts.length !== 0) {
      resultData.contexts.forEach(ctx => {
        if (!ctx.id || !ctx.resourceTypes[0]) {
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
          ctx.resourceTypes[0].id === RESOURCE_TYPE_LEARNING_PATH &&
          topics.resources.filter(obj => obj.path === resultItem.path)
            .length === 0 // skip if we already have it
        ) {
          topics.resources.push(resultItem);
        } else if (
          resource.resources.filter(obj => obj.path === resultItem.path)
            .length === 0 // skip if we already have it
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
  }),
};

export default injectT(WelcomePage);
