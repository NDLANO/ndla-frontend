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
import LicenseBox from '../../../components/LicenseBox';
import LicenseByline from '../../../components/LicenseByline';

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
    const { article, locale, licenseType, contentType } = this.props;
    const { expanded } = this.state;
    const expandedIcon = classnames({
      'u-expanded--svg': expanded,
    });


    return (
      <div className={classnames('license', { 'u-expanded': expanded })}>
        <button className="un-button license-toggler site-nav_link" onClick={this.toogleLicenseBox} >
          {expanded ? 'Lukk boks' : `Sitér eller bruk ${contentType.toLowerCase()}`}
        </button>
        <LicenseByline authors={article.copyright.authors} created={article.created} licenseType={licenseType} locale={locale} iconsClassName={expandedIcon} />
        { expanded &&
          <LicenseBox
            article={article}
            locale={locale}
            licenseType={licenseType}
          />
        }
      </div>
    );
  }
}

ArticleLicenses.propTypes = {
  article: PropTypes.object,
  contentType: PropTypes.string,
  locale: PropTypes.string,
  licenseType: PropTypes.string,
  licenseHandler: PropTypes.func,
};

export default injectT(ArticleLicenses);
