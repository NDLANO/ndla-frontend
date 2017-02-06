/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import TopicMenuItem from './TopicMenuItem';
import { TopicShape } from '../../../shapes';

const TopicMenu = ({ topics, heading, className }) => (
  <div className={classNames('c-topic-menu', className)}>
    <h1 className="c-topic-menu__header">{heading}</h1>
    <ul className="c-topic-menu__list">
      { topics.map(topic => <TopicMenuItem key={topic.id} collapsed={false} topic={topic} />)}
    </ul>
  </div>
);

TopicMenu.propTypes = {
  topics: PropTypes.arrayOf(TopicShape),
  heading: PropTypes.string.isRequired,
  className: PropTypes.string,
};


export default TopicMenu;
