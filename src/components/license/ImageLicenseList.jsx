/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import getLicenseByKey from './licenseConstants';
import LicenseByline from './LicenseByline';

const ImageLicenseInfo = ({ image, locale }) => (
  <li className="license__list-item">
    <img alt={image.altText} src={image.src} />
    <LicenseByline
      license={getLicenseByKey(image.copyright.license.license, locale)}
      locale={locale}
    >
      { image.copyright.authors.map(author => author.name).join(', ') }
    </LicenseByline>
  </li>
);

ImageLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    copyright: PropTypes.shape({
      authors: PropTypes.array.isRequired,
      lisence: PropTypes.shape({
        license: PropTypes.string.isRequired,
      }),
    }),
  }),
};

const ImageLicenseList = ({ images, heading, locale }) => (
  <div>
    <h2>{heading}</h2>
    <ul className="license__list">
      <li className="license__list-item">
        <ul className="license__list">
          { images.map((image, index) => <ImageLicenseInfo image={image} key={index} locale={locale} />) }
        </ul>
      </li>
    </ul>
  </div>
);

ImageLicenseList.propTypes = {
  heading: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
};

export default ImageLicenseList;
