/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { withApollo } from 'react-apollo';
import {
  OneColumn,
  TopicIntroductionList,
  ResourcesWrapper,
  ResourcesTitle,
  SubjectFilter,
  Breadcrumb,
  SubjectSidebarWrapper,
  SubjectContent,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { GraphQLSubjectShape } from '../../../graphqlShapes';
import { LocationShape } from '../../../shapes';
import { toBreadcrumbItems } from '../../../routeHelpers';
import { toTopicMenu } from '../../../util/topicsHelper';
import SubjectPageSidebar from './SubjectPageSidebar';
import { toTopic } from '../subjectPageHelpers';
import SubjectPageInformation from './SubjectPageInformation';
import SubjectEditorChoices from './SubjectEditorChoices';

const SubjectPageOneColumn = props => {
  const { subject, t, match, location, handleFilterClick } = props;

  if (!subject) {
    return null;
  }

  const urlParams = queryString.parse(location.search || '');
  const activeFilters = urlParams.filters ? urlParams.filters.split(',') : [];
  const { filters: subjectFilters } = subject;

  const subjectpage = subject && subject.subjectpage ? subject.subjectpage : {};

  const filters = subjectFilters.map(filter => ({
    ...filter,
    title: filter.name,
    value: filter.id,
  }));

  const { params: { subjectId } } = match;
  const { editorsChoices } = subjectpage;
  const topicsWithSubTopics =
    subject && subject.topics
      ? subject.topics
          .filter(
            topic => !topic || !topic.parent || topic.parent === subject.id,
          )
          .map(topic => toTopicMenu(topic, subject.topics))
      : [];

  return (
    <OneColumn noPadding>
      <SubjectContent
        breadcrumb={
          subject ? (
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
              onChange={handleFilterClick}
            />
            <TopicIntroductionList
              toTopic={toTopic(subjectId)}
              topics={topicsWithSubTopics}
            />
          </div>
        </ResourcesWrapper>
        <SubjectSidebarWrapper>
          <SubjectPageSidebar
            subjectpage={subjectpage}
            subjectId={subject.id}
          />
          <SubjectEditorChoices narrowScreen editorsChoices={editorsChoices} />
          <SubjectPageInformation subjectpage={subjectpage} />
        </SubjectSidebarWrapper>
      </SubjectContent>
    </OneColumn>
  );
};

SubjectPageOneColumn.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  subject: GraphQLSubjectShape,
  location: LocationShape,
  handleFilterClick: PropTypes.func.isRequired,
};

export default compose(withRouter, injectT, withApollo)(SubjectPageOneColumn);
