/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * FRI OG BEGRENSET
 */

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import getLicenseByAbbreviation from 'ndla-licenses';
import { LicenseByline } from 'ndla-ui';
import { ArticleShape } from '../../../shapes';
import { injectT } from '../../../i18n';
import LicenseBox from '../../../components/license/LicenseBox';

class ArticleLicenses extends Component {
  constructor() {
    super();
    this.toogleLicenseBox = this.toogleLicenseBox.bind(this);
    this.state = {
      expanded: false,
    };
  }

  toogleLicenseBox() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { article, locale, licenseType, contentType, t, showByline } = this.props;
    const authorsList = article.copyright.authors.map(author => author.name).join(', ');
    const license = getLicenseByAbbreviation(licenseType, locale);
    const { expanded } = this.state;

    return (
      <div className={classnames('c-licensebox license', { 'u-expanded': expanded })}>
        <button className="un-button license-toggler site-nav_link" onClick={this.toogleLicenseBox} >
          {expanded ? t('article.closeLicenseBox') : t('article.openLicenseBox', { contentType: contentType.toLowerCase() })}
        </button>

        {showByline ?
          <LicenseByline license={license}>
            <span className="article_meta">{authorsList}. Publisert: {article.created}</span>.
          </LicenseByline>
          :
          null
        }

        { expanded && <LicenseBox article={article} locale={locale} license={license} /> }
      </div>
    );
  }
}

ArticleLicenses.defaultProps = {
  showByline: false,
};

ArticleLicenses.propTypes = {
  article: ArticleShape.isRequired,
  contentType: PropTypes.string,
  locale: PropTypes.string,
  licenseType: PropTypes.string,
  licenseHandler: PropTypes.func,
  showByline: PropTypes.bool,
};

export default injectT(ArticleLicenses);
