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
import { GraphQLFrontpageShape } from '../../graphqlShapes';
import { frontpageQuery, subjectsQuery } from '../../queries';
import { runQueries } from '../../util/runQueries';
import WelcomePageInfo from './WelcomePageInfo';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import FrontpageSubjects from './FrontpageSubjects';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';
import { frontPageSearchQuery } from '../../queries';
import {
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_LEARNING_PATH,
} from '../../constants';
export class WelcomePage extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
      inputHasFocus: false,
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
    const { query, inputHasFocus } = this.state;
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
      query,
      resourceTypes: [
        RESOURCE_TYPE_LEARNING_PATH,
        RESOURCE_TYPE_SUBJECT_MATERIAL,
        RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
      ].join(),
    };

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
          query={frontPageSearchQuery}>
          {({ data, error }) =>
            error || (
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
                  query.length > 2 ? mapSearchToFrontPageStructure(data) : []
                }
                onSearchInputFocus={this.onSearchInputFocus}
                onSearchDeactiveFocusTrap={this.onSearchDeactiveFocusTrap}
                inputHasFocus={inputHasFocus}
                allResultUrl={`search?query=${query}`}
              />
            )
          }
        </Query>

        <main>
          {/* <div data-testid="category-list">{frontPageSubjects}</div> */}
          <OneColumn>
            <FrontpageSearchSection
              heading={t('welcomePage.search')}
              searchFieldValue={query}
              onSearchFieldChange={this.onSearchFieldChange}
              onSearch={this.onSearch}
              hideSearch={false}
            />

            {/* <FrontpageFilm
              imageUrl="/static/film_illustrasjon.svg"
              url="https://ndla.no/nb/film"
              messages={{
                header: t('welcomePage.film.header'),
                linkLabel: t('welcomePage.film.linkLabel'),
                text: t('welcomePage.film.text'),
              }}
            />*/}
            {/* <WelcomePageInfo /> */}
          </OneColumn>
        </main>
      </Fragment>
    );
  }
}

function mapSearchToFrontPageStructure(data) {
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
    title: 'Fag:', // TODO: translation
    contentType: 'results-frontpage',
    resources: [],
  };
  const topics = {
    title: 'Emne:', // TODO: translation
    contentType: 'results-frontpage',
    resources: [],
  };
  const resource = {
    title: 'Læringsressurser:', // TODO: translation
    contentType: 'results-frontpage',
    resources: [],
  };
  result.map(i => {
    if (i && i.contexts && i.contexts.length) {
      i.contexts.map(ctx => {
        const finalObj = {
          id: `${i.id}-${ctx.id}`,
          path: ctx.path,
          boldName: `${ctx.subject}:`,
          name: i.title,
          subName:
            ctx.resourceTypes[0] && ctx.resourceTypes[0].name
              ? ctx.resourceTypes[0].name
              : '',
        };
        if (
          ctx.resourceTypes[0].id === RESOURCE_TYPE_SUBJECT_MATERIAL &&
          !subjects.resources.filter(obj => obj.path === finalObj.path).length // skip if we allread have it
        ) {
          subjects.resources.push(finalObj);
        } else if (
          ctx.resourceTypes[0].id === RESOURCE_TYPE_LEARNING_PATH &&
          !topics.resources.filter(obj => obj.path === finalObj.path).length // skip if we allread have it
        ) {
          topics.resources.push(finalObj);
        } else if (
          ctx.resourceTypes[0].id === RESOURCE_TYPE_TASKS_AND_ACTIVITIES &&
          !resource.resources.filter(obj => obj.path === finalObj.path).length // skip if we allread have it
        ) {
          resource.resources.push(finalObj);
        }
      });
    }
  });
  const returnArray = [];
  // add groups into return array if there are any resources
  if (subjects.resources.length) {
    returnArray.push(subjects);
  }
  if (topics.resources.length) {
    returnArray.push(topics);
  }
  if (resource.resources.length) {
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
