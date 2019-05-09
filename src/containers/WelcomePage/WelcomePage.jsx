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
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_LEARNING_PATH,
  FRONTPAGE_CATEGORIES,
} from '../../constants';

// making a list from subjects without id
const topicsNotInNDLA = FRONTPAGE_CATEGORIES.categories.reduce(
  (accumulator, currentValue) =>
    currentValue.subjects && currentValue.subjects.length > 0
      ? accumulator.concat(
          currentValue.subjects
            .filter(subject => !subject.id)
            .map(subject => subject.name),
        )
      : accumulator,
  [],
);
const debounceCall = debounce(fun => fun(), 250);
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

  static async getInitialProps(ctx) {
    const { client } = ctx;
    return runQueries(client, [
      {
        query: frontpageQuery,
      },
      {
        query: subjectsQuery,
      },
    ]);
  }

  renderInfoText() {
    const { t } = this.props;
    return (
      <span>
        {topicsNotInNDLA.map((topic, index) => {
          const isLastTopic = index === topicsNotInNDLA.length - 1;
          return (
            <Fragment key={topic}>
              {isLastTopic && `${t('welcomePage.topicsConjunction')} `}
              <strong key={topic}>
                {topic}
                {index < topicsNotInNDLA.length - 2 && ','}{' '}
              </strong>
            </Fragment>
          );
        })}
        {t('welcomePage.topicsNotAvailableFromSearch')}
      </span>
    );
  }

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
      resourceTypes: [
        RESOURCE_TYPE_LEARNING_PATH,
        RESOURCE_TYPE_SUBJECT_MATERIAL,
        RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
      ].join(),
    };

    const needInfoTextInSearchSuggestions = topicsNotInNDLA.length > 0;

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
                  query.length > 2 ? mapSearchToFrontPageStructure(data, t) : []
                }
                infoText={
                  needInfoTextInSearchSuggestions && this.renderInfoText()
                }
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

function mapSearchToFrontPageStructure(data, t) {
  if (
    !data ||
    (data && !data.search) ||
    (data && data.search && !data.search.results) ||
    (data &&
      data.search &&
      data.search.results &&
      data.search.results.length === 0)
  ) {
    return [];
  }
  const result = data.search.results;
  // grouping
  const subjects = {
    title: `${t('contentTypes.subject-material')}:`,
    contentType: 'results-frontpage',
    resources: [],
  };
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
              ? ctx.resourceTypes[0].name
              : '',
        };
        if (
          ctx.resourceTypes[0].id === RESOURCE_TYPE_SUBJECT_MATERIAL &&
          subjects.resources.filter(obj => obj.path === resultItem.path)
            .length === 0 // skip if we already have it
        ) {
          subjects.resources.push(resultItem);
        } else if (
          ctx.resourceTypes[0].id === RESOURCE_TYPE_LEARNING_PATH &&
          topics.resources.filter(obj => obj.path === resultItem.path)
            .length === 0 // skip if we already have it
        ) {
          topics.resources.push(resultItem);
        } else if (
          ctx.resourceTypes[0].id === RESOURCE_TYPE_TASKS_AND_ACTIVITIES &&
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
