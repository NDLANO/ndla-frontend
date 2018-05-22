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
import {
  OneColumn,
  SubjectHero,
  ErrorMessage,
  TopicIntroductionList,
  FilterList,
  Breadcrumb,
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

const toTopic = subjectId => toTopicPartial(subjectId);

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
    const hasFailed = !!data.error;
    const urlParams = queryString.parse(location.search || '');
    const activeFilters = urlParams.filters ? urlParams.filters.split(',') : [];
    const { subject } = data;
    const { filters: subjectFilters } = subject;
    const filters = subjectFilters.map(filter => ({
      ...filter,
      title: filter.name,
      value: filter.id,
    }));
    const { params: { subjectId } } = match;

    const topicsWithSubTopics =
      subject && subject.topics
        ? subject.topics
            .filter(topic => !topic.parent || topic.parent === subject.id)
            .map(topic => toTopicMenu(topic, subject.topics))
        : [];

    return (
      <div>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
        </Helmet>
        <SubjectHero>
          <OneColumn cssModifier="narrow">
            <div className="c-hero__content">
              <section data-cy="breadcrumb-section">
                {subject && <Breadcrumb items={toBreadcrumbItems(subject)} />}
              </section>
            </div>
          </OneColumn>
        </SubjectHero>
        <OneColumn>
          <article className="c-article">
            <section className="u-4/6@desktop u-push-1/6@desktop">
              <FilterList
                options={filters}
                values={activeFilters}
                onChange={this.handleFilterClick}
              />
              {hasFailed ? (
                <ErrorMessage
                  messages={{
                    title: t('errorMessage.title'),
                    description: t('subjectPage.errorDescription'),
                    back: t('errorMessage.back'),
                    goToFrontPage: t('errorMessage.goToFrontPage'),
                  }}
                />
              ) : (
                <div className="c-resources" data-cy="topic-list">
                  <h1 className="c-resources__title">
                    {t('subjectPage.tabs.topics')}
                  </h1>
                  <TopicIntroductionList
                    toTopic={toTopic(subjectId)}
                    topics={topicsWithSubTopics}
                  />
                </div>
              )}
            </section>
          </article>
        </OneColumn>
      </div>
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

export default compose(withRouter, injectT, withTracker)(SubjectPage);
