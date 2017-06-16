/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { injectT } from '../../../i18n';

class SearchForm extends Component {
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
    const { searching, t } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className="search-form">
        <input
          type="text"
          className="search-form__query"
          onChange={this.handleQueryChange}
          value={this.state.query}
          placeholder={t('searchForm.placeholder')}
        />

        <Button
          className="search-form__button"
          submit
          square
          loading={searching}>
          {t('searchForm.btn')}
        </Button>
      </form>
    );
  }
}

SearchForm.propTypes = {
  query: PropTypes.string,
  searching: PropTypes.bool.isRequired,
  onSearchQuerySubmit: PropTypes.func.isRequired,
};

SearchForm.defaultProps = {
  query: '',
};

export default injectT(SearchForm);
