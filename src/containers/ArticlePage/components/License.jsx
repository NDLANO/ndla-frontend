/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import cc from './icons/cc.svg';

const License = licenseType => {
  const uriMap = type => {
    switch (type.licenseType.replace(/-/g, '')) {
      case 'byncnd' : return { img: [require('./icons/by.svg'), require('./icons/nc.svg'), require('./icons/nd.svg')] };
      case 'byncsa' : return { img: [require('./icons/by.svg'), require('./icons/nc.svg'), require('./icons/sa.svg')] };
      case 'bync' : return { img: [require('./icons/by.svg'), require('./icons/nc.svg')] };
      case 'bynd' : return { img: [require('./icons/by.svg'), require('./icons/nd.svg')] };
      case 'bysa' : return { img: [require('./icons/by.svg'), require('./icons/sa.svg')] };
      default : return { img: '' };
    }
  };

  return (
    <span>
      <img
        alt="Creative Commons"
        className="license__icons license__icons--mini"
        src={cc}
      />
      {
        uriMap(licenseType).img.map((uri, i) => (
          <img
            key={i}
            alt="CC icon"
            className="license__icons license__icons--mini"
            src={uri}
          />
        ))
      }
      <span>Fri gjenbruk</span>
    </span>
  );
};

License.propTypes = {
  licenseType: PropTypes.string.isRequired,
};

export default License;
