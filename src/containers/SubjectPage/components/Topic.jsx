/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';

class Topic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.collapsed,
    };
    this.handleCollapseClick = this.handleCollapseClick.bind(this);
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  handleCollapseClick() {
    this.toggleCollapsed();
  }

  toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const { topic } = this.props;
    const { collapsed } = this.state;
    const isLeaf = isEmpty(topic.subtopics);
    return (
      <li className={classNames('topic-menu__item', { 'topic-menu__item--active': collapsed })}>
        { !isLeaf ? <button className="un-button" onClick={this.handleCollapseClick}>{topic.name}</button> : topic.name }
        { collapsed && !isLeaf &&
          <ul className="topic-menu__list">
            { topic.subtopics.map(subtopic => <Topic key={subtopic.id} collapsed={false} topic={subtopic} />) }
          </ul>
        }
      </li>

    );
  }
}

Topic.propTypes = {
  topic: PropTypes.object.isRequired,
  collapsed: PropTypes.bool.isRequired,
};

export default Topic;
