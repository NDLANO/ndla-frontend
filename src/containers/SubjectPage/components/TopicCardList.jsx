/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import TopicCard from './TopicCard';
import { TopicShape } from '../../../shapes';

const TopicCardList = ({ topics, subjectId, className }) => (
  <div className={classNames('c-topic-card-list', className)} >
    { topics.map(topic => <TopicCard key={topic.id} subjectId={subjectId} topic={topic} />)}
  </div>
  );

TopicCardList.propTypes = {
  topics: PropTypes.arrayOf(TopicShape),
  className: PropTypes.string,
  subjectId: PropTypes.string.isRequired,
};

export default TopicCardList;
