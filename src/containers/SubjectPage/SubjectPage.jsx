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
  Image,
  ResourcesWrapper,
  ResourcesTitle,
  SubjectFilter,
  SubjectSidebarWrapper,
  SubjectLinks,
  Breadcrumb,
  SubjectContent,
  SubjectCarousel,
  SubjectAbout,
  SubjectShortcuts,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { withTracker } from 'ndla-tracker';
import { GraphQLSubjectShape, GraphqlErrorShape } from '../../graphqlShapes';
import { LocationShape } from '../../shapes';
import {
  toBreadcrumbItems,
  toTopicPartial,
  getUrnIdsFromProps,
  toSubjects,
} from '../../routeHelpers';
import { subjectQuery, resourceTypesWithSubTypesQuery } from '../../queries';
import { runQueries } from '../../util/runQueries';
import handleError from '../../util/handleError';
import { toTopicMenu } from '../../util/topicsHelper';
import SubjectPageSecondaryContent from './SubjectPageSecondaryContent';
import SubjectPageSocialMedia from './SubjectPageSocialMedia';
import SubjectTopical from './SubjectTopical';

const toTopic = subjectId => toTopicPartial(subjectId);

const getResources = field => field.resources || [];

const getSearchUrl = (subjectId, resourceType) => {
  const baseUrl = '/search';
  const searchParams = {
    'resource-types': resourceType.parent
      ? resourceType.parent.id
      : resourceType.id,
    contextFilters: resourceType.parent ? resourceType.id : undefined,
    page: 1,
    subjects: subjectId,
  };
  return `${baseUrl}?${queryString.stringify(searchParams)}`;
};

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
        {
          query: resourceTypesWithSubTypesQuery,
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
    if (!data || !data.subject || !data.resourceTypes) {
      return null;
    }

    const urlParams = queryString.parse(location.search || '');
    const activeFilters = urlParams.filters ? urlParams.filters.split(',') : [];
    const { subject, resourceTypes } = data;
    const {
      name: subjectName,
      filters: subjectFilters,
      subjectpage: {
        editorsChoices,
        latestContent,
        mostRead,
        topical,
        banner,
        facebook,
        twitter,
      },
    } = subject;

    const filters = subjectFilters.map(filter => ({
      ...filter,
      title: filter.name,
      value: filter.id,
    }));
    const subjectMaterialResourceType = resourceTypes.find(
      type => type.id === 'urn:resourcetype:subjectMaterial',
    );

    const flattenResourceTypes = subjectMaterialResourceType.subtypes
      ? [
          subjectMaterialResourceType,
          ...subjectMaterialResourceType.subtypes.map(subtype => ({
            ...subtype,
            parent: subjectMaterialResourceType,
          })),
        ]
      : [];

    const { params: { subjectId } } = match;

    const topicsWithSubTopics =
      subject && subject.topics
        ? subject.topics
            .filter(
              topic => !topic || !topic.parent || topic.parent === subject.id,
            )
            .map(topic => toTopicMenu(topic, subject.topics))
        : [];

    const editorsChoicesResources = getResources(editorsChoices).map(
      resource => ({
        title: resource.name,
        image: resource.meta ? resource.meta.metaImage : '',
        type:
          resource.resourceTypes && resource.resourceTypes.length > 1
            ? resource.resourceTypes[0].name
            : t('subjectPage.editorsChoices.unknown'),
        id: resource.meta ? resource.meta.id.toString() : '',
        text: resource.meta ? resource.meta.metaDescription : '',
        linkTo: toSubjects() + resource.path,
      }),
    );

    const mostReadResources = getResources(mostRead);
    const latestContentResources = getResources(latestContent);
    return (
      <article>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
        </Helmet>
        <SubjectHeader
          heading={subjectName || ''}
          images={[{ url: banner, types: Object.keys(breakpoints) }]}
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
                  label={t('subjectPage.subjectFilter.label')}
                  options={filters}
                  values={activeFilters}
                  onChange={this.handleFilterClick}
                />
                <TopicIntroductionList
                  toTopic={toTopic(subjectId)}
                  topics={topicsWithSubTopics}
                />
              </div>
            </ResourcesWrapper>
            <SubjectSidebarWrapper>
              <SubjectShortcuts
                messages={{
                  heading: t('subjectPage.subjectShortcuts.heading'),
                  showMore: t('subjectPage.subjectShortcuts.showMore'),
                  showLess: t('subjectPage.subjectShortcuts.showLess'),
                }}
                links={flattenResourceTypes.map(type => ({
                  text: type.name,
                  url: getSearchUrl(subject.id, type),
                }))}
              />
              <SubjectLinks
                heading={t('subjectPage.mostRead.heading')}
                links={mostReadResources.map(resource => ({
                  text: resource.name,
                  url: toSubjects() + resource.path,
                }))}
              />
              <SubjectCarousel
                title={t('subjectPage.editorsChoices.heading')}
                narrowScreen
                subjects={editorsChoicesResources}
              />
              <SubjectTopical topical={topical} />
              <SubjectAbout
                media={
                  <Image
                    alt="Forstørrelsesglass"
                    src="https://staging.api.ndla.no/image-api/raw/42-45210905.jpg"
                  />
                }
                heading="Om medieuttrykk og mediesamfunnet"
                description="Her kan det komme en tekstlig beskrivelse av hvordan faget er bygget opp eller hvilke særpreg dette faget har. Det kan også være i form av en film som introduserer faget"
              />
            </SubjectSidebarWrapper>
          </SubjectContent>
        </OneColumn>
        <SubjectCarousel
          wideScreen
          subjects={editorsChoicesResources}
          title={t('subjectPage.editorsChoices.heading')}
        />
        <SubjectPageSecondaryContent
          subjectName={subjectName}
          latestContentResources={latestContentResources}
        />
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

SubjectPage.defaultProps = {
  data: {
    subject: {
      subjectpage: {
        editorsChoices: {
          resources: [],
        },
        latestContent: {
          resources: [],
        },
        mostRead: {
          resources: [],
        },
      },
    },
  },
};

export default compose(withRouter, injectT, withTracker, withApollo)(
  SubjectPage,
);
