/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import config from '../../config';
import { LocationShape, ImageShape } from '../../shapes';

const PageMetadata = ({ title, metaData, description, locale, location }) => {
  const image =
    metaData && metaData.images && metaData.images.length > 0
      ? metaData.images[0]
      : undefined;
  const basename = locale === 'nb' ? '' : `/${locale}`;
  const url = `${config.ndlaFrontendDomain}${basename}${location.pathname}`;
  return (
    <Helmet>
      <meta name="twitter:card" content="summary" />
      <meta property="og:url" content={url} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image.src} />}
    </Helmet>
  );
};

PageMetadata.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  locale: PropTypes.string,
  location: LocationShape,
  metaData: PropTypes.shape({
    images: PropTypes.arrayOf(ImageShape),
  }),
};

export default withRouter(PageMetadata);
