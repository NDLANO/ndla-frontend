/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';

class Topic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.collapsed,
    };
  }


  render() {
    const { topic } = this.props;
    return (
      <li>{topic.name}</li>
    );
  }
}

Topic.propTypes = {
  topic: PropTypes.object.isRequired,
  collapsed: PropTypes.bool.isRequired,
};

export default Topic;
