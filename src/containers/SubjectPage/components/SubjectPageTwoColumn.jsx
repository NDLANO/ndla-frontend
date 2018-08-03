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
  SubjectChildContent,
  SubjectFlexWrapper,
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

const SubjectPageTwoColumn = props => {
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

  return [
    <OneColumn noPadding key="subjectpage_content">
      <SubjectContent twoColumns breadcrumb={breadcrumb}>
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
              twoColumns
            />
          </div>
        </ResourcesWrapper>
        <SubjectChildContent>
          <SubjectFlexWrapper>
            <SubjectPageSidebar
              subjectpage={subjectpage}
              subjectId={subjectId}
            />
          </SubjectFlexWrapper>
          <SubjectEditorChoices narrowScreen editorsChoices={editorsChoices} />
        </SubjectChildContent>
      </SubjectContent>
    </OneColumn>,
    <OneColumn key="subjectpage_information" noPadding>
      <SubjectChildContent>
        <SubjectFlexWrapper>
          <SubjectPageInformation subjectpage={subjectpage} />
        </SubjectFlexWrapper>
      </SubjectChildContent>
    </OneColumn>,
  ];
};

SubjectPageTwoColumn.propTypes = {
  handleFilterClick: PropTypes.func.isRequired,
  subjectpage: GraphQLSubjectPageShape,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  topics: PropTypes.arrayOf(TopicShape),
  breadcrumb: PropTypes.node,
  subjectId: PropTypes.string.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
};

export default compose(
  withRouter,
  injectT,
  withApollo,
)(SubjectPageTwoColumn);
