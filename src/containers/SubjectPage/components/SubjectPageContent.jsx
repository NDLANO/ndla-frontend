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
import { GraphQLSubjectShape } from '../../../graphqlShapes';
import MainTopic from './MainTopic';
import SubTopic from './SubTopic';
import { scrollToRef } from '../subjectPageHelpers';

const SubjectPageContent = ({
  subject,
  filterIds,
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
  subSubRef,
  subSubTopicId,
  setSubSubTopicId,
  setSelectedSubSubTopic,
  setSubSubTopic,
}) => {
  useEffect(() => {
    if (subSubTopicId) {
      scrollToRef(subSubRef);
    } else if (subTopicId) {
      scrollToRef(subRef);
    } else if (topicId) {
      scrollToRef(mainRef);
    }
  }, [topicId, subTopicId, subSubTopicId]);

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
    setSubSubTopicId(null);
    setSubSubTopic(null);
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
            filterIds={filterIds}
            setSelectedTopic={setSelectedTopic}
            setSubTopicId={setAndScrollToSubTopic}
            showResources={!subTopicId}
            subTopicId={subTopicId}
            locale={locale}
            ndlaFilm={ndlaFilm}
            setSubSubTopic={setSubSubTopic}
            setSubSubTopicId={setSubSubTopicId}
          />
        </div>
      )}
      {subTopicId && (
        <div ref={subRef}>
          <SubTopic
            topicId={subTopicId}
            subjectId={subject.id}
            filterIds={filterIds}
            setSelectedSubTopic={setSelectedSubTopic}
            locale={locale}
            ndlaFilm={ndlaFilm}
            setSubSubTopicId={setSubSubTopicId}
            subSubTopicId={subSubTopicId}
          />
        </div>
      )}
      {subSubTopicId && (
        <div ref={subSubRef}>
          <SubTopic
            topicId={subSubTopicId}
            subjectId={subject.id}
            filterIds={filterIds}
            setSelectedSubTopic={setSelectedSubSubTopic}
            locale={locale}
            ndlaFilm={ndlaFilm}
            setSubSubTopicId={setSubSubTopicId}
          />
        </div>
      )}
    </>
  );
};

SubjectPageContent.propTypes = {
  subject: GraphQLSubjectShape,
  filterIds: PropTypes.string,
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
  subSubRef: PropTypes.any.isRequired,
  subSubTopicId: PropTypes.string,
  setSubSubTopicId: PropTypes.func,
  setSubSubTopic: PropTypes.func,
  setSelectedSubSubTopic: PropTypes.func,
};

export default injectT(SubjectPageContent);
