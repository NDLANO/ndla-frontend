/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { NavigationBox } from '@ndla/ui';
import {
  GraphQLSubjectShape,
  GraphQLFilterShape,
} from '../../../graphqlShapes';
import MainTopic from './MainTopic';
import SubTopic from './SubTopic';

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
}) => {
  const mainRef = useRef(null);
  const subRef = useRef(null);

  useEffect(() => {
    if (subTopicId) {
      window.scrollTo({
        top:
          subRef.current.offsetTop - 100,
        behavior: 'smooth',
      });
    }
    else if (topicId) {
      window.scrollTo({
        top:
          mainRef.current.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  }, [topicId, subTopicId]);

  const mainTopics = subject.topics.map(topic => ({
    ...topic,
    label: topic.name,
  }));

  const onClickMainTopic = e => {
    e.preventDefault();
    const topic = mainTopics.find(
      topic => topic.label === e.currentTarget.textContent,
    );
    setTopicId(topic.id);
    setSubTopicId(null);
    setSubTopic(null);
  };
  
  return (
    <>
      <NavigationBox items={mainTopics} onClick={onClickMainTopic} />
      {topicId && 
        <div ref={mainRef}>
          <MainTopic
            topicId={topicId}
            subjectId={subject.id}
            filterIds={filter?.id}
            setSelectedTopic={setSelectedTopic}
            setSubTopicId={setSubTopicId}
            showResources={!subTopicId}
            locale={locale}
          />
        </div>
      }
      {subTopicId &&
        <div ref={subRef}>
          <SubTopic
            topicId={subTopicId}
            subjectId={subject.id}
            filterIds={filter?.id}
            setSelectedSubTopic={setSelectedSubTopic}
            locale={locale}
          />
        </div>
      }
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
  locale: PropTypes.string.isRequired,
};

export default injectT(SubjectPageContent);
