/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * FRI OG BEGRENSET
 */

import React, { PropTypes } from 'react';
import LicenseIconList from './LicenseIconList';
import getLicenseByKey from './licenseConstants';

const LicenseByline = ({ authors, created, locale, licenseType, iconsClassName }) => {
  const authorsList = authors.map(author => author.name).join(', ');

  const license = getLicenseByKey(licenseType, locale);

  return (
    <div className="license-byline">
      <LicenseIconList licenseRights={license.rights} iconsClassName={iconsClassName} />
      <div className="license-byline__body">
        <span>{ license.short }</span>
      </div>
      <div className="license-byline__body">
        <span className="article_meta">{authorsList}. Publisert: {created}</span>.
      </div>
    </div>
  );
};

LicenseByline.propTypes = {
  authors: PropTypes.array.isRequired,
  created: PropTypes.string,
  iconsClassName: PropTypes.string,
  locale: PropTypes.string.isRequired,
  licenseType: PropTypes.string.isRequired,
};

export default LicenseByline;
