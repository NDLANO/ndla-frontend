/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import TopicDescription from './TopicDescription';
import { TopicShape } from '../../../shapes';

const TopicDescriptionList = ({ topics, className, subjectId }) => (
  <div className={classNames('c-topic-desctiption-list', className)} >
    { topics.map(topic => <TopicDescription key={topic.id} subjectId={subjectId} topic={topic} />)}
  </div>
  );

TopicDescriptionList.propTypes = {
  subjectId: PropTypes.string.isRequired,
  topics: PropTypes.arrayOf(TopicShape).isRequired,
  className: PropTypes.string,
};

export default TopicDescriptionList;
