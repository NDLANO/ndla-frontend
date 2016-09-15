/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';
import polyglot from '../../i18n';

export default class SelectSearchSortOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: props.sort,
    };
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  handleSortChange(evt) {
    this.setState({ sort: evt.target.value }, () => {
      this.props.onSortOrderChange(this.state.sort);
    });
  }

  render() {
    return (
      <select
        className="search-sort-order"
        onChange={this.handleSortChange}
        value={this.state.sort}
      >
        <option value="relevance">{polyglot.t('searchForm.order.relevance')}</option>
        <option value="title">{polyglot.t('searchForm.order.title')}</option>
      </select>
    );
  }
}

SelectSearchSortOrder.propTypes = {
  sort: PropTypes.string.isRequired,
  onSortOrderChange: PropTypes.func.isRequired,
};

SelectSearchSortOrder.defaultProps = {
  sort: 'relevance',
};
