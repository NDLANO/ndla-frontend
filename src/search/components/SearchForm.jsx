/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';
import polyglot from '../../i18n';

export default class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.query,
    };
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleQueryChange(evt) {
    this.setState({ query: evt.target.value });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.props.onSearchQuerySubmit(this.state.query);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="search-form">
        <input
          type="text" className="search-form_query"
          onChange={this.handleQueryChange}
          value={this.state.query}
          placeholder={polyglot.t('searchForm.placeholder')}
        />

        <button type="submit" className="search-form_btn">{polyglot.t('searchForm.btn')}</button>
      </form>
    );
  }
}

SearchForm.propTypes = {
  query: PropTypes.string,
  onSearchQuerySubmit: PropTypes.func.isRequired,
};

SearchForm.defaultProps = {
  query: '',
};
