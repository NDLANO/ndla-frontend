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

const TopicCardList = ({ topics, className }) => (
  <div className={classNames('c-topic-card-list', className)} >
    { topics.map(topic => <TopicCard key={topic.id} topic={topic} />)}
  </div>
  );

TopicCardList.propTypes = {
  topics: PropTypes.array.isRequired,
  className: PropTypes.string,
};

export default TopicCardList;
