/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { NavigationBox } from '@ndla/ui';
import {
  GraphQLSubjectShape,
  GraphQLFilterShape,
} from '../../../graphqlShapes';
import { BreadCrumbShape } from '../../../shapes';
import Topic from './Topic';

const SubjectPageContent = ({
  subject,
  filter,
  topicId,
  subTopicId,
  setSubTopicId,
  setSubTopic,
  selectedTopic,
  selectedSubTopic,
  setSelectedTopic,
  setSelectedSubTopic,
  locale,
}) => {
  useEffect(() => {
    if (topicId) {
      const topic = mainTopics.find(topic => topic.id === topicId);
      setSelectedTopic(topic);
    }
    if (selectedSubTopic) {
      setSelectedSubTopic(selectedSubTopic);
    }
  }, []);

  const mainTopics = subject.topics.map(topic => ({
    ...topic,
    label: topic.name,
  }));

  const onClickMainTopic = e => {
    e.preventDefault();
    const topic = mainTopics.find(
      topic => topic.label === e.currentTarget.textContent,
    );
    setSelectedTopic(topic);
    setSubTopicId(null);
    setSubTopic(null);
  };

  return (
    <>
      <NavigationBox items={mainTopics} onClick={onClickMainTopic} />
      {selectedTopic && (
        <Topic
          topicId={selectedTopic.id}
          subjectId={subject.id}
          filterIds={filter.id}
          setSelectedSubTopic={setSelectedSubTopic}
          locale={locale}
        />
      )}
      {subTopicId && (
        <Topic
          topicId={subTopicId}
          subTopicId={subTopicId}
          selectedSubTopic={selectedSubTopic}
          setSelectedSubTopic={setSelectedSubTopic}
          subjectId={subject.id}
          filterIds={filter.id}
          locale={locale}
        />
      )}
    </>
  );
};

SubjectPageContent.propTypes = {
  subject: GraphQLSubjectShape,
  filter: GraphQLFilterShape,
  selectedTopic: BreadCrumbShape,
  selectedSubTopic: BreadCrumbShape,
  setSelectedTopic: PropTypes.func,
  setSelectedSubTopic: PropTypes.func,
  locale: PropTypes.string.isRequired,
};

export default injectT(SubjectPageContent);
