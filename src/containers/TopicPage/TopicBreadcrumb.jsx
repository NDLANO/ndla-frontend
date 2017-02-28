/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import SafeLink from 'ndla-ui/lib/common/SafeLink';
import { SubjectShape, TopicShape } from '../../shapes';

const Crumb = ({ to, children }) => (
  <li>
    <SafeLink to={to}>
      {children}
    </SafeLink>
  </li>
);

Crumb.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

const TopicBreadcrumb = ({ subject, topicPath, toTopic }) => {
  const topicIds = topicPath.map(topic => topic.id);
  return (
    <ul>
      <Crumb key={subject.id} topicIds={[]} to={toTopic(subject.id)}>{subject.name}</Crumb>
      { topicPath.map((topic, i) =>
        <Crumb key={topic.id} topicIds={topicIds.slice(0, 1 + i)} to={toTopic(subject.id, ...topicIds.slice(0, 1 + i))}>
          {topic.name}
        </Crumb>)
      }
    </ul>
  );
};

TopicBreadcrumb.propTypes = {
  subject: SubjectShape.isRequired,
  topicPath: PropTypes.arrayOf(TopicShape),
  toTopic: PropTypes.func.isRequired,
};

export default TopicBreadcrumb;
