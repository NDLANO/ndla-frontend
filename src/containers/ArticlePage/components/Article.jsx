/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';

import { Article as UIArticle, LicenseByline } from 'ndla-ui';
import {
  addEventListenerForResize,
  updateIFrameDimensions,
  addAsideClickListener,
  removeEventListenerForResize,
  removeAsideClickListener } from 'ndla-article-scripts';
import getLicenseByAbbreviation from 'ndla-licenses';
import { injectT } from '../../../i18n';
import ToggleLicenseBox from './ToggleLicenseBox';
import LicenseBox from '../../../components/license/LicenseBox';


class Article extends Component {

  componentDidMount() {
    addEventListenerForResize();
    updateIFrameDimensions();
    addAsideClickListener();
  }

  componentWillUnmount() {
    removeEventListenerForResize();
    removeAsideClickListener();
  }

  renderToggleLicenseBox(showByline = false) {
    const { article, locale, t } = this.props;
    const licenseType = article.copyright.license.license;
    const authorsList = article.copyright.authors.map(author => author.name).join(', ');
    const license = getLicenseByAbbreviation(licenseType, locale);

    return (
      <ToggleLicenseBox
        openTitle={t('article.openLicenseBox', { contentType: article.contentType.toLowerCase() })}
        closeTitle={t('article.closeLicenseBox')}
        licenseBox={<LicenseBox article={article} locale={locale} license={license} />}
      >
        { showByline ?
          <LicenseByline license={license}>
            <span className="article_meta">{authorsList}. Publisert: {article.created}</span>.
          </LicenseByline>
          : null
        }
      </ToggleLicenseBox>
    );
  }

  render() {
    const { article } = this.props;

    return (
      <UIArticle>
        {this.renderToggleLicenseBox()}
        <h1>{article.title}</h1>
        <UIArticle.Introduction introduction={article.introduction} />
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
        { article.footNotes ? <UIArticle.FootNotes footNotes={article.footNotes} /> : null }
        {this.renderToggleLicenseBox(true)}
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
