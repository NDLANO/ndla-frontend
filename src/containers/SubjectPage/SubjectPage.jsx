/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import Helmet from 'react-helmet';
import { withApollo } from 'react-apollo';
import { SubjectHeader } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { withTracker } from 'ndla-tracker';
import { GraphQLSubjectShape, GraphqlErrorShape } from '../../graphqlShapes';
import { LocationShape } from '../../shapes';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { subjectQuery } from '../../queries';
import { runQueries } from '../../util/runQueries';
import handleError from '../../util/handleError';
import SubjectPageSecondaryContent from './components/SubjectPageSecondaryContent';
import SubjectPageSocialMedia from './components/SubjectPageSocialMedia';
import SubjectPageOneColumn from './components/SubjectPageOneColumn';
import SubjectPageTwoColumn from './components/SubjectPageTwoColumn';
import SubjectEditorChoices from './components/SubjectEditorChoices';
import { getResources } from './subjectPageHelpers';

class SubjectPage extends Component {
  static async getInitialProps(ctx) {
    const { client, location } = ctx;
    const { subjectId } = getUrnIdsFromProps(ctx);
    const urlParams = queryString.parse(location.search || '');
    try {
      return runQueries(client, [
        {
          query: subjectQuery,
          variables: { subjectId, filterIds: urlParams.filters || '' },
        },
      ]);
    } catch (error) {
      handleError(error);
      return null;
    }
  }

  static getDocumentTitle({ t, data }) {
    return `${data && data.subject ? data.subject.name : ''} ${t(
      'htmlTitles.titleTemplate',
    )}`;
  }

  static willTrackPageView(trackPageView, currentProps) {
    const { data } = currentProps;
    if (
      data &&
      data.subject &&
      data.subject.topics &&
      data.subject.topics.length > 0
    ) {
      trackPageView(currentProps);
    }
  }

  handleFilterClick = newValues => {
    const { history } = this.props;
    const searchString = `?${queryString.stringify({
      filters: newValues.join(','),
    })}`;
    history.push(
      newValues.length > 0
        ? {
            search: searchString,
          }
        : {},
    );
  };

  render() {
    const { data } = this.props;

    if (!data || !data.subject) {
      return null;
    }
    const { subject } = data;
    const { name: subjectName } = subject;

    const subjectpage =
      subject && subject.subjectpage ? subject.subjectpage : {};

    const {
      latestContent,
      facebook,
      twitter,
      banner,
      editorsChoices,
      displayInTwoColumns,
    } = subjectpage;

    const latestContentResources = getResources(latestContent);
    return (
      <article>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
        </Helmet>
        <SubjectHeader
          heading={subjectName || ''}
          images={[
            {
              url: banner ? banner.desktopUrl : '',
              types: ['wide', 'desktop', 'tablet'],
            },
            { url: banner ? banner.mobileUrl : '', types: ['mobile'] },
          ]}
        />
        {displayInTwoColumns ? (
          <SubjectPageTwoColumn
            subject={subject}
            handleFilterClick={this.handleFilterClick}
          />
        ) : (
          <SubjectPageOneColumn
            subject={subject}
            handleFilterClick={this.handleFilterClick}
          />
        )}
        <SubjectEditorChoices wideScreen editorsChoices={editorsChoices} />
        {latestContent && (
          <SubjectPageSecondaryContent
            subjectName={subjectName}
            latestContentResources={latestContentResources}
          />
        )}
        <SubjectPageSocialMedia twitter={twitter} facebook={facebook} />
      </article>
    );
  }
}

SubjectPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    subject: GraphQLSubjectShape,
    error: GraphqlErrorShape,
  }),
  location: LocationShape,
};

export default compose(withRouter, injectT, withTracker, withApollo)(
  SubjectPage,
);
