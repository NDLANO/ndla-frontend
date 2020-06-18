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
  NavigationBox,
} from '@ndla/ui';
import {
  GraphQLSubjectPageShape,
  GraphQLSubjectShape,
} from '../../../graphqlShapes';
import { TopicShape } from '../../../shapes';
import MainTopic from './MainTopic';

const SubjectPageContent = ({ subject, filter, locale, activeFilters, handleFilterClick }) => {
  const [mainTopicId, setMainTopicId] = useState(null);

  const mainTopics = subject.topics.map(topic => ({
    ...topic,
    label: topic.name
  }))

  const onClickMainTopic = e => {
    e.preventDefault();
    const topic = mainTopics.find(topic => topic.label === e.currentTarget.textContent);
    setMainTopicId(topic.id);
  }

  return (
    <>
      <NavigationBox items={mainTopics} onClick={onClickMainTopic}/>
      {mainTopicId && 
        <MainTopic 
          topicId={mainTopicId}
          subjectId={subject.id}
          filterIds={filter.id}
          locale={locale}
        />
      }
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
