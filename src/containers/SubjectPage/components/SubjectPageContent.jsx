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
import Topic from './Topic';
import { scrollToRef } from '../subjectPageHelpers';
import { toTopic } from '../../../routeHelpers';

const SubjectPageContent = ({
  subject,
  filterIds,
  locale,
  ndlaFilm,
  onClickTopics,
  topics,
  refs,
  setBreadCrumb,
}) => {
  useEffect(() => {
    if (topics.length) scrollToRef(refs[topics.length - 1]);
  }, [topics]);

  const mainTopics = subject.topics.map(topic => {
    return {
      ...topic,
      label: topic.name,
      selected: topic.id === topics[0],
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
          onClickTopics(e);
        }}
      />
      {topics.map((t, index) => {
        return (
          <div ref={refs[index]}>
            <Topic
              topicId={topics[index]}
              subjectId={subject.id}
              filterIds={filterIds}
              setBreadCrumb={setBreadCrumb}
              subTopicId={topics[index + 1]}
              locale={locale}
              ndlaFilm={ndlaFilm}
              onClickTopics={onClickTopics}
              index={index}
            />
          </div>
        );
      })}
    </>
  );
};

SubjectPageContent.propTypes = {
  subject: GraphQLSubjectShape,
  filterIds: PropTypes.string,
  ndlaFilm: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  onClickTopics: PropTypes.func,
  topics: PropTypes.arrayOf(PropTypes.string),
  refs: PropTypes.array.isRequired,
  setBreadCrumb: PropTypes.func,
};

export default injectT(SubjectPageContent);
