/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * FRI OG BEGRENSET
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Icon from './icons/Icons';
import { BY, NC, ND, SA } from './licenseConstants';

const LicenseIcon = ({ licenseRight, className }) => {
  switch (licenseRight) {
    case BY: return <Icon.LicenseBy className={className} />;
    case NC: return <Icon.LicenseNc className={className} />;
    case ND: return <Icon.LicenseNd className={className} />;
    case SA: return <Icon.LicenseSa className={className} />;
    default: return undefined;
  }
};

LicenseIcon.propTypes = {
  licenseRight: PropTypes.string.isRequired,
};

const LicenseIconList = ({ licenseRights, iconsClassName }) => {
  const className = classNames('license__icon', 'license__icon--mini', iconsClassName);

  return (
    <div className="license-byline__icons">
      <Icon.LicenseCc className={className} />
      {
        licenseRights.map(licenseRight => <LicenseIcon licenseRight={licenseRight} className={className} key={licenseRight} />)
      }
    </div>
  );
};
LicenseIconList.propTypes = {
  licenseRights: PropTypes.array.isRequired,
  iconsClassName: PropTypes.string,
};

export default LicenseIconList;
