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
import { SubjectHeader, Breadcrumb } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { withTracker } from 'ndla-tracker';
import { GraphQLSubjectShape, GraphqlErrorShape } from '../../graphqlShapes';
import { LocationShape } from '../../shapes';
import { getUrnIdsFromProps, toBreadcrumbItems } from '../../routeHelpers';
import { subjectPageQuery } from '../../queries';
import { runQueries } from '../../util/runQueries';
import handleError from '../../util/handleError';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import SubjectPageSecondaryContent from './components/SubjectPageSecondaryContent';
import SubjectPageSocialMedia from './components/SubjectPageSocialMedia';
import SubjectPageOneColumn from './components/SubjectPageOneColumn';
import SubjectPageTwoColumn from './components/SubjectPageTwoColumn';
import SubjectEditorChoices from './components/SubjectEditorChoices';
import { getResources } from './subjectPageHelpers';
import { toTopicMenu } from '../../util/topicsHelper';
import {
  getFiltersFromUrl,
  getFiltersFromUrlAsArray,
} from '../../util/filterHelper';

class SubjectPage extends Component {
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

  static getDocumentTitle({ t, data }) {
    return `${data && data.subject ? data.subject.name : ''} ${t(
      'htmlTitles.titleTemplate',
    )}`;
  }

  static async getInitialProps(ctx) {
    const { client, location } = ctx;
    const { subjectId } = getUrnIdsFromProps(ctx);
    try {
      return runQueries(client, [
        {
          query: subjectPageQuery,
          variables: { subjectId, filterIds: getFiltersFromUrl(location) },
        },
      ]);
    } catch (error) {
      handleError(error);
      return null;
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
    const {
      data,
      loading,
      match: {
        params: { subjectId },
      },
      location,
      t,
    } = this.props;

    if (loading && (!data || !data.subject)) {
      return null;
    }

    if (!data || !data.subject) {
      return <DefaultErrorMessage />;
    }
    const activeFilters = getFiltersFromUrlAsArray(location);
    const { subject } = data;
    const { name: subjectName, filters: subjectFilters } = subject;

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
    const filters = subjectFilters.map(filter => ({
      ...filter,
      title: filter.name,
      value: filter.id,
    }));
    const topicsWithSubTopics =
      subject && subject.topics
        ? subject.topics
            .filter(
              topic => !topic || !topic.parent || topic.parent === subject.id,
            )
            .map(topic => toTopicMenu(topic, subject.topics))
        : [];

    const breadcrumb = subject ? (
      <Breadcrumb
        items={toBreadcrumbItems(
          t('breadcrumb.toFrontpage'),
          subject,
          undefined,
          undefined,
        )}
      />
    ) : (
      undefined
    );
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
            subjectId={subjectId}
            subjectpage={subjectpage}
            topics={topicsWithSubTopics}
            breadcrumb={breadcrumb}
            filters={filters}
            activeFilters={activeFilters}
            handleFilterClick={this.handleFilterClick}
          />
        ) : (
          <SubjectPageOneColumn
            subjectId={subjectId}
            subjectpage={subjectpage}
            topics={topicsWithSubTopics}
            breadcrumb={breadcrumb}
            filters={filters}
            activeFilters={activeFilters}
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default compose(
  withRouter,
  injectT,
  withTracker,
  withApollo,
)(SubjectPage);
