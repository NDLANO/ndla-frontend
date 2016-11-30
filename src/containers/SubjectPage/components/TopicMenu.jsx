/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import Topic from './Topic';

const TopicMenu = ({ topics }) => (
  <ul>
    { topics.map(topic => <Topic key={topic.id} collapsed={false} topic={topic} />)}
  </ul>
);

TopicMenu.propTypes = {
  topics: PropTypes.array.isRequired,
};


export default TopicMenu;
