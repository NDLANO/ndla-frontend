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
import { GraphQLFrontpageShape } from '../../graphqlShapes';
import { frontpageQuery, subjectsQuery } from '../../queries';
import { runQueries } from '../../util/runQueries';
import WelcomePageInfo from './WelcomePageInfo';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import FrontpageSubjects from './FrontpageSubjects';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';

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

    const results = [
      {
        title: 'Fag:',
        contentType: 'results-frontpage',
        resources: [
          {
            path: '#f1',
            boldName: 'Yrkesfag:',
            name: 'Design og håndverk',
            subName: 'Vg3',
          },
          {
            path: '#f2',
            boldName: 'Yrkesfag:',
            name: 'Helsearbeiderfag',
            subName: 'Vg1',
          },
          {
            path: '#f2',
            boldName: 'Fellesfag:',
            name: 'Samfunnsfag',
          },
        ],
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
        <FrontpageHeader
          hideSearch={false}
          locale={locale}
          heading={t('welcomePage.heading.heading')}
          searchFieldValue={query}
          onSearch={this.onSearch}
          onSearchFieldChange={this.onSearchFieldChange}
          menuSubject={frontPageSubjects}
          searchFieldPlaceholder={t(
            'welcomePage.heading.searchFieldPlaceholder',
          )}
          messages={headerMessages}
          links={headerLinks}
          searchResult={query.length > 2 ? results : []}
          onSearchInputFocus={this.onSearchInputFocus}
          onSearchDeactiveFocusTrap={this.onSearchDeactiveFocusTrap}
          inputHasFocus={inputHasFocus}
          allResultUrl={`search?query=${query}`}
        />

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
