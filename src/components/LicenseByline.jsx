/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * FRI OG BEGRENSET
 */

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames'
import Icon from './icons/Icons';
import LicenseBox from './LicenseBox';

class LicenseByline extends Component {
  constructor() {
    super();
    this.state = {
      hideLicenseByline: false,
      expandLicense: true
    }
    this.licenseExpander = this.licenseExpander.bind(this)
  }
  licenseExpander() {
    this.setState({
      expandLicense: !this.state.expandLicense
    })
  }

  render() {
    const { article, licenseType, contentType } = this.props;
    const { licenseHandler } = this.props || true
    const { expandLicense, hideLicenseByline } = this.state
    const licenseClass = classnames({
      'u-hide': hideLicenseByline,
      'u-expanded': expandLicense
    });
    const expandedIcon = classnames({
      'u-expanded--svg': expandLicense
    })

    const licenseMap = (type) => {
      switch (type.replace(/-/g, '')) {
        case 'cc' : return { img: [<Icon.LicenseCc className={expandedIcon}/>] };
        case 'byncnd' : return { img: [<Icon.LicenseCc className={expandedIcon}/>, <Icon.LicenseBy className={expandedIcon}/>, <Icon.LicenseNc className={expandedIcon}/>, <Icon.LicenseNd className={expandedIcon}/>] };
        case 'byncsa' : return { img: [<Icon.LicenseCc className={expandedIcon}/>, <Icon.LicenseBy className={expandedIcon}/>, <Icon.LicenseNc className={expandedIcon}/>, <Icon.LicenseSa className={expandedIcon}/>] };
        case 'bync' : return { img: [<Icon.LicenseCc className={expandedIcon}/>, <Icon.LicenseBy className={expandedIcon}/>, <Icon.LicenseNc className={expandedIcon}/>] };
        case 'bynd' : return { img: [<Icon.LicenseCc className={expandedIcon}/>, <Icon.LicenseBy className={expandedIcon}/>, <Icon.LicenseNd className={expandedIcon}/>] };
        case 'bysa' : return { img: [<Icon.LicenseCc className={expandedIcon}/>, <Icon.LicenseBy className={expandedIcon}/>, <Icon.LicenseSa className={expandedIcon}/>] };
        default : return { img: [] };
      }
    };

    return (
      <div className={classnames('license', {'u-expanded': expandLicense})}>
        <div className="license-byline">
          <div className="license-byline__icons">
            {
              licenseMap(licenseType).img.map(((licenseIcon, index) => licenseIcon))
            }
          </div>
          <div className="license-byline__body">
            <span>Fri gjenbruk</span>
          </div>
          {
            licenseHandler && contentType ? <button className="un-button license-toggler site-nav_link" onClick={this.licenseExpander}>{expandLicense ? 'Lukk boks' : `Sitér eller bruk ${contentType.toLowerCase()}`} </button> : null
          }
        </div>
        { expandLicense && <LicenseBox
          article={article}
          licenseType={licenseType} /> }
      </div>
    );
  };
};

LicenseByline.propTypes = {
  contentType: PropTypes.string,
  licenseType: PropTypes.string,
  licenseHandler: PropTypes.func,
};

export default LicenseByline;
