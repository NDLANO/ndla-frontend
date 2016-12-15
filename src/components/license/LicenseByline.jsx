/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * FRI OG BEGRENSET
 */

import React, { PropTypes } from 'react';
import { LicenseIconList } from 'ndla-ui';

const LicenseByline = ({ children, license, iconsClassName }) => (
  <div className="license-byline">
    <LicenseIconList licenseRights={license.rights} iconsClassName={iconsClassName} />
    <div className="license-byline__body">
      <span>{ license.short }</span>
    </div>
    { children ?
      <div className="license-byline__body">
        { children }
      </div>
    : null}
  </div>
);

LicenseByline.propTypes = {
  license: PropTypes.shape({
    short: PropTypes.string.isRequired,
    rights: PropTypes.array.isRequired,
  }).isRequired,
  iconsClassName: PropTypes.string,
  children: PropTypes.node,
};

export default LicenseByline;
