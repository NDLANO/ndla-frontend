/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import * as actions from './articleActions';
import { getArticle } from './articleSelectors';

class ArticlePage extends Component {
  componentWillMount() {
    const { fetchArticle } = this.props;
    fetchArticle('100');
  }

  render() {
    const { article } = this.props;
    return (
      <div>
        <h1>{article.titles ? article.titles[0].title : null}</h1>
      </div>
    );
  }
}

ArticlePage.propTypes = {
  article: PropTypes.object.isRequired,
  fetchArticle: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
};

const mapStateToProps = (state) => ({
  article: getArticle(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticlePage);
