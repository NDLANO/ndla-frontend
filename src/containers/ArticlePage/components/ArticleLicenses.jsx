/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * FRI OG BEGRENSET
 */

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { injectT } from '../../../i18n';
import LicenseBox from '../../../components/license/LicenseBox';
import getLicenseByKey from '../../../components/license/licenseConstants';
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
    const { article, locale, licenseType, contentType, t, mini } = this.props;
    const authorsList = article.copyright.authors.map(author => author.name).join(', ');
    const license = getLicenseByKey(licenseType, locale);
    const { expanded } = this.state;
    const expandedIcon = classnames({
      'u-expanded--svg': expanded,
    });


    return (
      <div className={classnames('license', { 'u-expanded': expanded })}>
        {mini ? <button className="un-button license-toggler site-nav_link" onClick={this.toogleLicenseBox} >
          {expanded ? t('article.closeLicenseBox') : t('article.openLicenseBox', { contentType: contentType.toLowerCase() })}
        </button> : <button className="un-button license-toggler site-nav_link" onClick={this.toogleLicenseBox} >
          {expanded ? t('article.closeLicenseBox') : t('article.openLicenseBox', { contentType: contentType.toLowerCase() })}
        </button>
        }
        {mini ? null : <LicenseByline license={license} locale={locale} iconsClassName={expandedIcon}>
          <span className="article_meta">{authorsList}. Publisert: {article.created}</span>.
        </LicenseByline>
        }

        { expanded &&
          <LicenseBox
            article={article}
            locale={locale}
            license={license}
          />
        }
      </div>
    );
  }
}

ArticleLicenses.DefaultPropTypes = {
  mini: false,
};

ArticleLicenses.propTypes = {
  article: PropTypes.object.isRequired,
  contentType: PropTypes.string,
  locale: PropTypes.string,
  licenseType: PropTypes.string,
  licenseHandler: PropTypes.func,
  mini: PropTypes.bool,
};

export default injectT(ArticleLicenses);
