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
import { withApollo } from 'react-apollo';
import {
  OneColumn,
  TopicIntroductionList,
  ResourcesWrapper,
  ResourcesTitle,
  SubjectFilter,
  SubjectSidebarWrapper,
  SubjectContent,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { GraphQLSubjectPageShape } from '../../../graphqlShapes';
import { TopicShape } from '../../../shapes';
import SubjectPageSidebar from './SubjectPageSidebar';
import { toTopic } from '../subjectPageHelpers';
import SubjectPageInformation from './SubjectPageInformation';
import SubjectEditorChoices from './SubjectEditorChoices';
import { topicIntroductionMessages } from '../../../util/topicsHelper';

const SubjectPageOneColumn = props => {
  const {
    subjectpage,
    t,
    handleFilterClick,
    filters,
    topics,
    breadcrumb,
    subjectId,
    activeFilters,
  } = props;
  const { editorsChoices } = subjectpage;

  return (
    <OneColumn noPadding>
      <SubjectContent breadcrumb={breadcrumb}>
        <ResourcesWrapper
          subjectPage
          header={<ResourcesTitle>Emner</ResourcesTitle>}>
          <div data-testid="topic-list">
            <SubjectFilter
              label={t('subjectPage.subjectFilter.label')}
              options={filters}
              values={activeFilters}
              onChange={handleFilterClick}
            />
            <TopicIntroductionList
              toTopic={toTopic(subjectId, activeFilters)}
              topics={topics}
              messages={topicIntroductionMessages(t)}
              toggleAdditionalCores={() => {}}
            />
          </div>
        </ResourcesWrapper>
        <SubjectSidebarWrapper>
          <SubjectPageSidebar subjectpage={subjectpage} subjectId={subjectId} />
          <SubjectEditorChoices narrowScreen editorsChoices={editorsChoices} />
          <SubjectPageInformation subjectpage={subjectpage} />
        </SubjectSidebarWrapper>
      </SubjectContent>
    </OneColumn>
  );
};

SubjectPageOneColumn.propTypes = {
  handleFilterClick: PropTypes.func.isRequired,
  subjectpage: GraphQLSubjectPageShape,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  topics: PropTypes.arrayOf(TopicShape),
  subjectId: PropTypes.string.isRequired,
  breadcrumb: PropTypes.node,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
};

export default compose(
  withRouter,
  injectT,
  withApollo,
)(SubjectPageOneColumn);
