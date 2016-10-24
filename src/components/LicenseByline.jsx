/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * FRI OG BEGRENSET
 */

import React, { PropTypes } from 'react';
import Icon from './icons/Icons';

const LicenseByline = ({ ...props }) => {
  const { licenseType, licenseHandler, contentType } = props;

  const licenseMap = (type) => {
    switch (type.replace(/-/g, '')) {
      case 'cc' : return { img: [<Icon.LicenseCc />] };
      case 'byncnd' : return { img: [<Icon.LicenseCc />, <Icon.LicenseBy />, <Icon.LicenseNc />, <Icon.LicenseNd />] };
      case 'byncsa' : return { img: [<Icon.LicenseCc />, <Icon.LicenseBy />, <Icon.LicenseNc />, <Icon.LicenseSa />] };
      case 'bync' : return { img: [<Icon.LicenseCc />, <Icon.LicenseBy />, <Icon.LicenseNc />] };
      case 'bynd' : return { img: [<Icon.LicenseCc />, <Icon.LicenseBy />, <Icon.LicenseNd />] };
      case 'bysa' : return { img: [<Icon.LicenseCc />, <Icon.LicenseBy />, <Icon.LicenseSa />] };
      default : return { img: [] };
    }
  };

  return (
    <div className="license-byline">
      <div className="license-byline__icons">

        {
          licenseMap(licenseType).img.map(((licenseIcon, index) => (<span key={index}>{licenseIcon}</span>)))
        }
      </div>
      <div className="license-byline__body">
        <span>Fri gjenbruk</span>
      </div>
      {
        licenseHandler && contentType ? <button className="license-toggler site-nav_link" onClick={licenseHandler}>Sitér eller bruk {contentType.toLowerCase()}</button> : null
      }
    </div>
  );
};

LicenseByline.propTypes = {
  contentType: PropTypes.string,
  licenseType: PropTypes.string,
  licenseHandler: PropTypes.func,
};

export default LicenseByline;
