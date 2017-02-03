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

const classes = new BEMHelper({
  name: 'topic-menu',
  prefix: 'c-',
});

const TopicMenu = ({ topics }) => (
  <div {...classes('', '', 'o-wrapper u-1/1')}>
    <ul {...classes('list')}>
      { topics.map(topic =>
        (<li {...classes('item')} key={topic.id}>
          <Link {...classes('link')} to={`/topics/${topic.id}`}>{ topic.name }</Link>
        </li>),
      ) }
    </ul>
  </div>
);

TopicMenu.propTypes = {
  topics: PropTypes.array.isRequired,
};

export default TopicMenu;
