/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * FRI OG BEGRENSET
 */

import React, { PropTypes } from 'react';


const LicenseByline = ({...props}) => {
    const { licenseType, licenseHandler, contentType } = props

  const uriMap = type => {
    switch (type.replace(/-/g, '')) {
      case 'cc' : return { img: [require('./icons/cc.svg')] };
      case 'byncnd' : return { img: [require('./icons/cc.svg'), require('./icons/by.svg'), require('./icons/nc.svg'), require('./icons/nd.svg')] };
      case 'byncsa' : return { img: [require('./icons/cc.svg'), require('./icons/by.svg'), require('./icons/nc.svg'), require('./icons/sa.svg')] };
      case 'bync' : return { img: [require('./icons/cc.svg'), require('./icons/by.svg'), require('./icons/nc.svg')] };
      case 'bynd' : return { img: [require('./icons/cc.svg'), require('./icons/by.svg'), require('./icons/nd.svg')] };
      case 'bysa' : return { img: [require('./icons/cc.svg'), require('./icons/by.svg'), require('./icons/sa.svg')] };
      default : return { img: [] };
    }
  };

  return (
    <div className="license-byline">
      <div className="license-byline__icons">
		    {
          uriMap(licenseType).img.map((uri, i) => (
            <img
              key={i}
              alt="CC icon"
              className="license-byline__icon license__icon--mini"
              src={uri}
            />
        ))
        }
	    </div>
	    <div className="license-byline__body">
		    <span>Fri gjenbruk</span>
	    </div>
      {
        licenseHandler && contentType ? <a className="license-toggler site-nav_link" onClick={licenseHandler}>Sitér eller bruk {contentType.toLowerCase()}</a> : null
      }
    </div>
  );
};

LicenseByline.propTypes = {
  licenseType: PropTypes.string.isRequired,
};

export default LicenseByline;
