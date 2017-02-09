/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';

import { Article, enableResponsiveTables } from 'ndla-ui';
import ArticleFootNotes from '../../ArticlePage/components/ArticleFootNotes';
import { ArticleShape } from '../../../shapes';
import {
  addEventListenerForResize,
  updateIFrameDimensions,
  addAsideClickListener,
  removeEventListenerForResize,
  removeAsideClickListener,
} from '../../../util/articleScripts';


class TopicArticle extends Component {

  componentDidMount() {
    addEventListenerForResize();
    updateIFrameDimensions();
    enableResponsiveTables();
    addAsideClickListener();
  }

  componentWillUnmount() {
    removeEventListenerForResize();
    removeAsideClickListener();
  }

  render() {
    const { article } = this.props;

    return (
      <Article>
        <h1>{article.title}</h1>
        <Article.Introduction introduction={article.introduction} />
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
        { article.footNotes ? <ArticleFootNotes footNotes={article.footNotes} /> : null }
      </Article>
    );
  }
}


TopicArticle.propTypes = {
  article: ArticleShape.isRequired,
};

export default TopicArticle;
