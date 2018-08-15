/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { compose } from 'redux';
import {
  FrontpageHeader,
  FrontpageSearchSection,
  OneColumn,
  BetaNotification,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { GraphQLFrontpageShape } from '../../graphqlShapes';
import { frontpageQuery, subjectsQuery } from '../../queries';
import { runQueries } from '../../util/runQueries';
import WelcomePageInfo from './WelcomePageInfo';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import FrontpageSubjects from './FrontpageSubjects';
import FrontpageHighlights from './FrontpageHighlights';

export class WelcomePage extends Component {
  constructor() {
    super();
    this.state = {
      expanded: null,
      query: '',
      acceptedBeta: true,
    };
  }

  componentDidMount() {
    this.setState({ acceptedBeta: localStorage.getItem('acceptedBeta') });
  }

  onExpand = expanded => {
    this.setState({ expanded });
  };

  onSearchFieldChange = evt => {
    evt.preventDefault();
    this.setState({ query: evt.target.value });
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

  onAccept = () => {
    localStorage.setItem('acceptedBeta', true);
    this.setState({ acceptedBeta: true });
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

    const { subjects } = data;
    const frontpage = data && data.frontpage ? data.frontpage : {};
    const { categories = [], topical } = frontpage;
    const { expanded, query } = this.state;
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
    return (
      <Fragment>
        {!this.state.acceptedBeta && (
          <BetaNotification
            messages={{
              heading: t('welcomePage.betaMessages.heading'),
              text: t('welcomePage.betaMessages.text'),
              readmoreText: t('welcomePage.betaMessages.readmoreText'),
              readmoreLink: t('welcomePage.betaMessages.readmoreLink'),
              buttonText: t('welcomePage.betaMessages.buttonText'),
            }}
            onAccept={this.onAccept}
          />
        )}
        <FrontpageHeader
          heading={t('welcomePage.heading.heading')}
          searchFieldValue={query}
          onSearch={this.onSearch}
          onSearchFieldChange={this.onSearchFieldChange}
          searchFieldPlaceholder={t(
            'welcomePage.heading.searchFieldPlaceholder',
          )}
          messages={headerMessages}
          links={headerLinks}
        />

        <main>
          <div data-testid="category-list">
            <FrontpageSubjects
              locale={locale}
              expanded={expanded}
              subjects={subjects}
              categories={categories}
              onExpand={this.onExpand}
            />
          </div>
          <OneColumn>
            <FrontpageSearchSection
              heading={t('welcomePage.search')}
              searchFieldValue={query}
              onSearchFieldChange={this.onSearchFieldChange}
              onSearch={this.onSearch}
            />
            <FrontpageHighlights topical={topical} />
            <WelcomePageInfo />
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

export default compose(injectT)(WelcomePage);
