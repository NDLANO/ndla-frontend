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
import { breakpoints } from 'ndla-util';
import { withApollo } from 'react-apollo';
import {
  OneColumn,
  SubjectHeader,
  TopicIntroductionList,
  ResourcesWrapper,
  ResourcesTitle,
  SubjectFilter,
  Breadcrumb,
  SubjectContent,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { withTracker } from 'ndla-tracker';
import { GraphQLSubjectShape, GraphqlErrorShape } from '../../graphqlShapes';
import { LocationShape } from '../../shapes';
import {
  toBreadcrumbItems,
  toTopicPartial,
  getUrnIdsFromProps,
} from '../../routeHelpers';
import { subjectQuery } from '../../queries';
import { runQueries } from '../../util/runQueries';
import handleError from '../../util/handleError';
import { toTopicMenu } from '../../util/topicsHelper';
import SubjectPageSecondaryContent from './components/SubjectPageSecondaryContent';
import SubjectPageSocialMedia from './components/SubjectPageSocialMedia';
import SubjectEditorChoices from './components/SubjectEditorChoices';
import SubjectPageSidebar from './components/SubjectPageSidebar';

const toTopic = subjectId => toTopicPartial(subjectId);

export const getResources = field =>
  field && field.resources ? field.resources : [];

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
    const { data, t, match, location } = this.props;

    if (!data || !data.subject) {
      return null;
    }

    const urlParams = queryString.parse(location.search || '');
    const activeFilters = urlParams.filters ? urlParams.filters.split(',') : [];
    const { subject } = data;
    const { name: subjectName, filters: subjectFilters } = subject;

    const subjectpage =
      subject && subject.subjectpage ? subject.subjectpage : {};

    const {
      editorsChoices,
      latestContent,
      banner,
      facebook,
      twitter,
      displayInTwoColumns,
    } = subjectpage;

    const filters = subjectFilters.map(filter => ({
      ...filter,
      title: filter.name,
      value: filter.id,
    }));

    const { params: { subjectId } } = match;

    const topicsWithSubTopics =
      subject && subject.topics
        ? subject.topics
            .filter(
              topic => !topic || !topic.parent || topic.parent === subject.id,
            )
            .map(topic => toTopicMenu(topic, subject.topics))
        : [];

    const latestContentResources = getResources(latestContent);
    return (
      <article>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
        </Helmet>
        <SubjectHeader
          heading={subjectName || ''}
          images={[{ url: banner || '', types: Object.keys(breakpoints) }]}
        />
        <OneColumn noPadding>
          <SubjectContent
            twoColumns={displayInTwoColumns}
            breadcrumb={
              subject ? (
                <Breadcrumb items={toBreadcrumbItems(subject)} />
              ) : (
                undefined
              )
            }>
            <ResourcesWrapper
              subjectPage
              header={<ResourcesTitle>Emner</ResourcesTitle>}>
              <div data-cy="topic-list">
                <SubjectFilter
                  label={t('subjectPage.subjectFilter.label')}
                  options={filters}
                  values={activeFilters}
                  onChange={this.handleFilterClick}
                />
                <TopicIntroductionList
                  toTopic={toTopic(subjectId)}
                  topics={topicsWithSubTopics}
                  twoColumns={displayInTwoColumns}
                />
              </div>
            </ResourcesWrapper>
            <SubjectPageSidebar
              subjectpage={subjectpage}
              subjectId={subject.id}
            />
          </SubjectContent>
        </OneColumn>
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
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
