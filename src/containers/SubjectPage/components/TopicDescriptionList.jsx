/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import BEMHelper from 'react-bem-helper';
import { TopicShape } from '../../../shapes';
import { toTopic } from '../../../routes';

const classes = new BEMHelper({
  name: 'topic-description',
  prefix: 'c-',
});

const TopicDescription = ({ topic, subjectId }) => (
  <li {...classes('item')}>
    <h1 {...classes('header')}>{topic.name}</h1>
    {topic.introduction ? <p>{topic.introduction}</p> : null}
    <Link {...classes('topic-link')} to={toTopic(subjectId, topic.id)}>Gå til emnet</Link>
  </li>
);

TopicDescription.propTypes = {
  topic: TopicShape.isRequired,
  subjectId: PropTypes.string.isRequired,
};

const TopicDescriptionList = ({ topics, subjectId }) => (
  <ul {...classes('list')} >
    { topics.map(topic => <TopicDescription key={topic.id} subjectId={subjectId} topic={topic} />)}
  </ul>
  );

TopicDescriptionList.propTypes = {
  subjectId: PropTypes.string.isRequired,
  topics: PropTypes.arrayOf(TopicShape).isRequired,
};

export default TopicDescriptionList;
