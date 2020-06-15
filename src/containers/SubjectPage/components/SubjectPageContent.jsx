/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { 
  SubjectFilter,
  NavigationBox,
} from '@ndla/ui';
import {
  GraphQLSubjectPageShape,
  GraphQLSubjectShape,
} from '../../../graphqlShapes';
import { TopicShape } from '../../../shapes';

const SubjectPageContent = ({ subject, activeFilters, handleFilterClick }) => {

  const options = subject.filters.map(filter => ({
    ...filter,
    title: filter.name,
    value: filter.id
  }))

  const topicItems = subject.topics.map(topic => ({
    ...topic,
    label: topic.name
  }))
  return (
    <>
      <SubjectFilter
        label='Filter'
        options={options}
        values={activeFilters}
        onChange={handleFilterClick}
      />
      <NavigationBox items={topicItems}/>
    </>
  );
}

SubjectPageContent.propTypes = {
  handleFilterClick: PropTypes.func.isRequired,
  subjectpage: GraphQLSubjectPageShape,
  subject: GraphQLSubjectShape,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  topics: PropTypes.arrayOf(TopicShape),
  subjectId: PropTypes.string.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  layout: PropTypes.oneOf(['single', 'double', 'stacked']),
  skipToContentId: PropTypes.string.isRequired,
};

export default injectT(SubjectPageContent);
