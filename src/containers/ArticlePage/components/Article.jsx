/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';

import { Article as UIArticle } from 'ndla-ui';
import ArticleFootNotes from './ArticleFootNotes';
import { injectT } from '../../../i18n';
import ArticleLicenses from './ArticleLicenses';


class Article extends Component {

  static updateIFrameDimensions() {
    document.querySelectorAll('.article__oembed iframe')
      .forEach((el) => {
        const iframe = el;
        const parentWidth = iframe.parentNode.clientWidth;
        const newHeight = (iframe.clientHeight * parentWidth) / iframe.clientWidth;
        iframe.height = newHeight;
        iframe.width = parentWidth;
      });
  }

  componentDidMount() {
    window.addEventListener('resize', Article.updateIFrameDimensions);
    Article.updateIFrameDimensions();

    document.querySelectorAll('.c-article aside > div')
      .forEach((el) => {
        const target = el;
        target.onclick = () => target.classList.toggle('expanded');
      });
  }


  componentWillUnmount() {
    window.removeEventListener('resize', Article.updateIFrameDimensions);

    document.querySelectorAll('.c-article aside > div')
      .forEach((el) => {
        const target = el;
        target.onclick = undefined;
      });
  }


  render() {
    const { article, locale } = this.props;

    const licenseType = article.copyright.license.license;

    return (
      <UIArticle>
        <ArticleLicenses
          article={article}
          locale={locale}
          licenseType={licenseType}
          contentType={article.contentType}
        />
        <h1>{article.title}</h1>
        <UIArticle.Introduction introduction={article.introduction} />
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
        { article.footNotes ? <ArticleFootNotes footNotes={article.footNotes} /> : null }
        <ArticleLicenses
          showByline
          article={article}
          locale={locale}
          licenseType={licenseType}
          contentType={article.contentType}
        />
      </UIArticle>
    );
  }
}


Article.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    copyright: PropTypes.shape({
      authors: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
};


export default injectT(Article);
