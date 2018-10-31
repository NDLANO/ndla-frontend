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
  SubjectSidebarWrapper,
  SubjectContent,
} from 'ndla-ui';
import { GraphQLSubjectPageShape } from '../../../../graphqlShapes';
import { TopicShape } from '../../../../shapes';
import SubjectPageSidebar from '../SubjectPageSidebar';
import SubjectPageInformation from '../SubjectPageInformation';
import SubjectEditorChoices from '../SubjectEditorChoices';
import SubjectPageTopics from '../SubjectPageTopics';

const SubjectPageOneColumn = props => {
  const {
    subjectpage,
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
        <SubjectPageTopics
          handleFilterClick={handleFilterClick}
          filters={filters}
          topics={topics}
          subjectId={subjectId}
          activeFilters={activeFilters}
        />
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
  withApollo,
)(SubjectPageOneColumn);
