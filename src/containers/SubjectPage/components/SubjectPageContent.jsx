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
import MainTopic from './MainTopic';
import SubTopic from './SubTopic';
import { scrollToRef } from '../subjectPageHelpers';

const SubjectPageContent = ({
  subject,
  filter,
  topicId,
  setTopicId,
  subTopicId,
  setSubTopicId,
  setSubTopic,
  setSelectedTopic,
  setSelectedSubTopic,
  locale,
  ndlaFilm,
  mainRef,
  subRef,
}) => {
  useEffect(() => {
    if (subTopicId) {
      scrollToRef(subRef);
    } else if (topicId) {
      scrollToRef(mainRef);
    }
  }, [topicId, subTopicId]);

  const mainTopics = subject.topics.map(topic => ({
    ...topic,
    label: topic.name,
    selected: topic.id === topicId,
  }));

  const setAndScrollToSubTopic = id => {
    if (id === subTopicId) {
      scrollToRef(subRef);
    }
    setSubTopicId(id);
  };

  const onClickMainTopic = e => {
    e.preventDefault();
    const topic = mainTopics.find(
      topic => topic.label === e.currentTarget.textContent,
    );
    if (topic.id === topicId) {
      scrollToRef(mainRef);
    }
    setTopicId(topic.id);
    setSubTopicId(null);
    setSubTopic(null);
  };

  return (
    <>
      <NavigationBox
        items={mainTopics}
        onClick={onClickMainTopic}
        invertedStyle={ndlaFilm}
        isButtonElements
        listDirection="horizontal"
      />
      {topicId && (
        <div ref={mainRef}>
          <MainTopic
            topicId={topicId}
            subjectId={subject.id}
            filterIds={filter?.id}
            setSelectedTopic={setSelectedTopic}
            setSubTopicId={setAndScrollToSubTopic}
            showResources={!subTopicId}
            subTopicId={subTopicId}
            locale={locale}
            ndlaFilm={ndlaFilm}
          />
        </div>
      )}
      {subTopicId && (
        <div ref={subRef}>
          <SubTopic
            topicId={subTopicId}
            subjectId={subject.id}
            filterIds={filter?.id}
            setSelectedSubTopic={setSelectedSubTopic}
            locale={locale}
            ndlaFilm={ndlaFilm}
          />
        </div>
      )}
    </>
  );
};

SubjectPageContent.propTypes = {
  subject: GraphQLSubjectShape,
  filter: GraphQLFilterShape,
  topicId: PropTypes.string,
  subTopicId: PropTypes.string,
  setTopicId: PropTypes.func,
  setSubTopicId: PropTypes.func,
  setSubTopic: PropTypes.func,
  setSelectedTopic: PropTypes.func,
  setSelectedSubTopic: PropTypes.func,
  ndlaFilm: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  mainRef: PropTypes.any.isRequired,
  subRef: PropTypes.any.isRequired,
};

export default injectT(SubjectPageContent);
