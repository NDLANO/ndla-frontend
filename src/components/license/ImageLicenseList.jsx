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
  MediaListCCLink,
  MediaListItemMeta,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import CopyTextButton from './CopyTextButton';
import { CopyrightObjectShape } from '../../shapes';

const getSrcSets = image => {
  const src = encodeURI(image.src);
  return [
    `${src}?width=1440 1440w`,
    `${src}?width=1120 1120w`,
    `${src}?width=1000 1000w`,
    `${src}?width=960 960w`,
    `${src}?width=800 800w`,
    `${src}?width=640 640w`,
    `${src}?width=480 480w`,
    `${src}?width=320 320w`,
    `${src}?width=320 320w`,
  ].join(', ');
};

const ImageLicenseInfo = ({ image, locale, t }) => {
  const items = [
    ...image.copyright.authors.map(author => ({
      label: author.type,
      description: author.name,
    })),
    { label: t('images.source'), description: image.copyright.origin },
  ];

  return (
    <MediaListItem>
      <MediaListItemImage>
        <img
          alt={image.altText}
          src={`${image.src}`}
          srcSet={getSrcSets(image)}
        />
      </MediaListItemImage>
      <MediaListItemBody
        title={t('images.rules')}
        license={image.copyright.license.license}
        locale={locale}>
        <MediaListCCLink>{t('learnMore')}</MediaListCCLink>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
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
    </MediaListItem>
  );
};

ImageLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  image: CopyrightObjectShape.isRequired,
};

const ImageLicenseList = ({ images, locale, t }) => (
  <div>
    <h2>{t('images.heading')}</h2>
    <p>{t('images.description')}</p>
    <MediaList>
      {images.map(image => (
        <ImageLicenseInfo image={image} key={uuid()} locale={locale} t={t} />
      ))}
    </MediaList>
  </div>
);

ImageLicenseList.propTypes = {
  locale: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(CopyrightObjectShape),
};

export default injectT(ImageLicenseList, 'license.');
