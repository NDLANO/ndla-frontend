/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { TopicShape } from '../../../shapes';

const SubtopicLink = ({ classes, to, subtopic }) => (
  <li {...classes('subtopic-item')} key={subtopic.id}>
    <Link {...classes('link', 'underline')} to={to}>{ subtopic.name }</Link>
  </li>
);

SubtopicLink.propTypes = {
  classes: PropTypes.func.isRequired,
  subtopic: TopicShape.isRequired,
  to: PropTypes.string.isRequired,
};

const SubtopicLinkList = ({ className, classes, topic, toTopic }) => (
  <div className={className}>
    <Link {...classes('link', ['underline', 'big'])} to={toTopic(topic.id)}>{ topic.name } {'>'}</Link>
    <ul {...classes('list')}>
      { topic.subtopics.map(subtopic =>
        <SubtopicLink classes={classes} key={subtopic.id} to={toTopic(topic.id, subtopic.id)} subtopic={subtopic} />,
      )}
    </ul>
  </div>
);

SubtopicLinkList.propTypes = {
  classes: PropTypes.func.isRequired,
  className: PropTypes.string,
  topic: TopicShape.isRequired,
  toTopic: PropTypes.func.isRequired,
};

export default SubtopicLinkList;
