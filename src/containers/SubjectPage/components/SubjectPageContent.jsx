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
  GraphQLSubjectShape,
  GraphQLFilterShape,
} from '../../../graphqlShapes';
import Topic from './Topic';

const SubjectPageContent = ({ subject, filter, locale }) => {
  const [mainTopicId, setMainTopicId] = useState(null);
  const [subTopicId, setSubTopicId] = useState(null);

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
        <Topic 
          topicId={mainTopicId}
          subjectId={subject.id}
          filterIds={filter.id}
          setSubTopicId={setSubTopicId}
          locale={locale}
        />
      }
      {subTopicId && 
        <Topic
          topicId={subTopicId}
          subjectId={subject.id}
          filterIds={filter.id}
          locale={locale}
        />
      }
    </>
  );
}

SubjectPageContent.propTypes = {
  subject: GraphQLSubjectShape,
  filter: GraphQLFilterShape,
  locale: PropTypes.string.isRequired,
};

export default injectT(SubjectPageContent);
