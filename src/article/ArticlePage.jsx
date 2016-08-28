/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import polyglot from '../i18n';

import * as actions from './articleActions';

class ArticlePage extends Component {
  componentWillMount() {
    const { fetchArticle } = this.props;
    fetchArticle('100');
  }

  render() {
    return (
      <div>
        <h1>{polyglot.t('hello.world')}</h1>
      </div>
    );
  }

}

ArticlePage.propTypes = {
  fetchArticle: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
};


export default connect(state => state, mapDispatchToProps)(ArticlePage);
