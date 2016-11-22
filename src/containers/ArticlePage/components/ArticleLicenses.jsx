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
import { injectT } from '../../../i18n';
import LicenseBox from '../../../components/license/LicenseBox';
import LicenseByline from '../../../components/license/LicenseByline';

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
    const expandedIcon = classnames({
      'u-expanded--svg': expanded,
    });


    return (
      <div className={classnames('license', { 'u-expanded': expanded })}>
        <button className="un-button license-toggler site-nav_link" onClick={this.toogleLicenseBox} >
          {expanded ? t('article.closeLicenseBox') : t('article.openLicenseBox', { contentType: contentType.toLowerCase() })}
        </button>

        {showByline ?
          <LicenseByline license={license} locale={locale} iconsClassName={expandedIcon}>
            <span className="article_meta">{authorsList}. Publisert: {article.created}</span>.
          </LicenseByline>
          :
          null
        }

        { expanded &&
          <LicenseBox
            article={article}
            locale={locale}
            license={license}
          >
            <LicenseByline license={license} locale={locale} iconsClassName={expandedIcon}>
              <span className="article_meta">{authorsList}. Publisert: {article.created}</span>.
            </LicenseByline>
          </LicenseBox>
        }
      </div>
    );
  }
}

ArticleLicenses.defaultProps = {
  showByline: false,
};

ArticleLicenses.propTypes = {
  article: PropTypes.object.isRequired,
  contentType: PropTypes.string,
  locale: PropTypes.string,
  licenseType: PropTypes.string,
  licenseHandler: PropTypes.func,
  showByline: PropTypes.bool,
};

export default injectT(ArticleLicenses);
