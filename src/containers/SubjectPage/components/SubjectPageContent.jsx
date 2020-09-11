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
import { toTopic } from '../../../routeHelpers';

const SubjectPageContent = ({
  subject,
  filterIds,
  topicId,
  subTopicId,
  setSelectedTopic,
  setSelectedSubTopic,
  locale,
  ndlaFilm,
  mainRef,
  subRef,
  subSubRef,
  subSubTopicId,
  setSelectedSubSubTopic,
  onClickTopics,
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

  const mainTopics = subject.topics.map(topic => {
    return {
      ...topic,
      label: topic.name,
      selected: topic.id === topicId,
      url: toTopic(subject.id, filterIds, topic.id),
    };
  });

  return (
    <>
      <NavigationBox
        items={mainTopics}
        invertedStyle={ndlaFilm}
        listDirection="horizontal"
        onClick={e => {
          onClickTopics(e, mainTopics)
        }}
      />
      {topicId && (
        <div ref={mainRef}>
          <MainTopic
            topicId={topicId}
            subjectId={subject.id}
            filterIds={filterIds}
            setSelectedTopic={setSelectedTopic}
            showResources={!subTopicId}
            subTopicId={subTopicId}
            locale={locale}
            ndlaFilm={ndlaFilm}
            onClickTopics={onClickTopics}
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
            subSubTopicId={subSubTopicId}
            onClickTopics={onClickTopics}
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
            onClickTopics={onClickTopics}
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
  setSubTopic: PropTypes.func,
  setSelectedTopic: PropTypes.func,
  setSelectedSubTopic: PropTypes.func,
  ndlaFilm: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  mainRef: PropTypes.any.isRequired,
  subRef: PropTypes.any.isRequired,
  subSubRef: PropTypes.any.isRequired,
  subSubTopicId: PropTypes.string,
  setSelectedSubSubTopic: PropTypes.func,
  onClickTopics: PropTypes.func,
};

export default injectT(SubjectPageContent);
