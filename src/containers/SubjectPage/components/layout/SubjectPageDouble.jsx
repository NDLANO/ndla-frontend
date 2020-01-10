/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';
import {
  OneColumn,
  SubjectChildContent,
  SubjectFlexWrapper,
  SubjectContent,
} from '@ndla/ui';
import { GraphQLSubjectPageShape } from '../../../../graphqlShapes';
import { TopicShape } from '../../../../shapes';
import SubjectPageSidebar from '../SubjectPageSidebar';
import SubjectPageInformation from '../SubjectPageInformation';
import SubjectEditorChoices from '../SubjectEditorChoices';
import SubjectPageTopics from '../SubjectPageTopics';

const SubjectPageTwoColumn = props => {
  const {
    subjectpage,
    handleFilterClick,
    filters,
    topics,
    breadcrumb,
    subjectId,
    locale,
    activeFilters,
  } = props;
  const { editorsChoices } = subjectpage;

  return [
    <OneColumn key="subjectpage_content">
      <SubjectContent twoColumns breadcrumb={breadcrumb}>
        <SubjectPageTopics
          handleFilterClick={handleFilterClick}
          filters={filters}
          topics={topics}
          subjectId={subjectId}
          activeFilters={activeFilters}
          twoColumns
        />
        <SubjectChildContent>
          <SubjectFlexWrapper>
            <SubjectPageSidebar
              subjectpage={subjectpage}
              subjectId={subjectId}
              locale={locale}
              twoColumns
            />
          </SubjectFlexWrapper>
          <SubjectEditorChoices
            narrowScreen
            editorsChoices={editorsChoices}
            locale={locale}
          />
        </SubjectChildContent>
      </SubjectContent>
    </OneColumn>,
    <OneColumn key="subjectpage_information" noPadding>
      <SubjectChildContent>
        <SubjectFlexWrapper>
          <SubjectPageInformation subjectpage={subjectpage} twoColumns />
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
  locale: PropTypes.string.isRequired,
};

export default withRouter(SubjectPageTwoColumn);
