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
import {
  OneColumn,
  SubjectHeader,
  ErrorMessage,
  TopicIntroductionList,
  FilterList,
  ResourcesWrapper,
  ResourcesTitle,
  SubjectFilter,
  SubjectSidebarWrapper,
  SubjectLinks,
  Breadcrumb,
  SubjectContent,
  SubjectChildContent,
  SubjectSocialSection,
  SubjectSocialContent,
  EmbeddedFacebook,
  EmbeddedTwitter,
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
    const { filters: subjectFilters, topics, subjectpage } = subject;
    const filters = subjectFilters.map(filter => ({
      ...filter,
      title: filter.name,
      value: filter.id,
    }));
    const { params: { subjectId } } = match;
    console.log(data);
    return (
      <article>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
        </Helmet>
        <SubjectHeader
          heading={subject.name || ''}
          images={[
            { url: subjectpage.banner, types: Object.keys(breakpoints) },
          ]}
        />
        <OneColumn noPadding>
          <SubjectContent
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
              <div>
                <SubjectFilter
                  label="Filter"
                  options={filters}
                  values={activeFilters}
                  onChange={this.handleFilterClick}
                />
                <TopicIntroductionList
                  toTopic={toTopic(subjectId)}
                  topics={topics}
                />
              </div>
            </ResourcesWrapper>
            <SubjectSidebarWrapper>
              <SubjectLinks
                heading="Mest lest"
                links={subjectpage.mostRead.resources.map(resource => ({
                  text: resource.name,
                  url: `${resource.path}`,
                }))}
              />
            </SubjectSidebarWrapper>
          </SubjectContent>
        </OneColumn>
        <OneColumn noPadding>
          <SubjectChildContent>
            <SubjectSocialContent>
              <SubjectSocialSection title="Twitter">
                <EmbeddedTwitter
                  screenName={subjectpage.twitter.substring(1)}
                  tweetLimit={1}
                />
              </SubjectSocialSection>
              <SubjectSocialSection title="Facebook">
                <EmbeddedFacebook
                  href={`https://www.facebook.com/${
                    subjectpage.facebook
                  }/posts/1648640581877981`}
                />
              </SubjectSocialSection>
            </SubjectSocialContent>
          </SubjectChildContent>
        </OneColumn>
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

export default compose(withRouter, injectT, withTracker)(SubjectPage);
