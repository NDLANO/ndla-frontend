/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { uuid } from 'ndla-util';
import {
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { MediaListItemMeta } from './MediaList';
import CopyTextButton from './CopyTextButton';
import { CopyrightObjectShape } from '../../shapes';

const getSrcSets = image =>
  [
    `${image.src}?width=1440 1440w`,
    `${image.src}?width=1120 1120w`,
    `${image.src}?width=1000 1000w`,
    `${image.src}?width=960 960w`,
    `${image.src}?width=800 800w`,
    `${image.src}?width=640 640w`,
    `${image.src}?width=480 480w`,
    `${image.src}?width=320 320w`,
    `${image.src}?width=320 320w`,
  ].join(', ');

const ImageLicenseInfo = ({ image, locale, t }) =>
  <MediaListItem>
    <MediaListItemImage>
      <img
        alt={image.altText}
        src={`${image.src}`}
        srcSet={getSrcSets(image)}
        sizes="(min-width: 800px) 360px, (min-width: 600px) 300px, 100vw"
      />
    </MediaListItemImage>
    <MediaListItemBody
      title={t('rules')}
      license={image.copyright.license.license}
      locale={locale}>
      <MediaListItemActions>
        <div className="c-medialist__ref">
          <h3 className="c-medialist__title">
            {t('howToReference')}
          </h3>
          <MediaListItemMeta authors={image.copyright.authors} />
          <CopyTextButton
            authors={image.copyright.authors}
            copyTitle={t('copyTitle')}
            hasCopiedTitle={t('hasCopiedTitle')}
          />
          <a
            href={image.src}
            className="c-button c-button--outline c-licenseToggle__button"
            download>
            {t('download')}
          </a>
        </div>
      </MediaListItemActions>
    </MediaListItemBody>
  </MediaListItem>;

ImageLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  image: CopyrightObjectShape.isRequired,
};

const ImageLicenseList = ({ images, heading, description, locale, t }) =>
  <div>
    <h2>
      {heading}
    </h2>
    <p>
      {description}
    </p>
    <MediaList>
      {images.map(image =>
        <ImageLicenseInfo image={image} key={uuid()} locale={locale} t={t} />,
      )}
    </MediaList>
  </div>;

ImageLicenseList.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(CopyrightObjectShape),
};

export default injectT(ImageLicenseList, 'license.images.');
