/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import isFunction from 'lodash/isFunction';

/* Disable default styles for tabs */
Tabs.setUseDefaultStyles(false);

const TabPanelContainer = ({ content }) => <TabPanel> { isFunction(content) ? content() : content } </TabPanel>;

TabPanelContainer.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
};


class TabsContainer extends Component {
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      index: 0,
    };
  }

  handleSelect(index) {
    this.setState({
      index,
    });
  }

  render() {
    const { tabs } = this.props;

    return (
      <Tabs onSelect={this.handleSelect} selectedIndex={this.state.index} >
        <TabList>
          { tabs.map(tab => <Tab key={tab.key}>{tab.displayName}</Tab>) }
        </TabList>
        { tabs.map(tab => <TabPanel key={tab.key}>{ isFunction(tab.content) ? tab.content() : tab.content }</TabPanel>) }
      </Tabs>
    );
  }
}

TabsContainer.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]).isRequired,
  })),
};


export default TabsContainer;
