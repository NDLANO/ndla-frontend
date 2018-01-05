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
  Image,
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { metaTypes, getGroupedContributorDescriptionList } from 'ndla-licenses';
import CopyTextButton from './CopyTextButton';
import { CopyrightObjectShape } from '../../shapes';
import { getCopyrightCopyString } from './getCopyrightCopyString';

const ImageShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
  copyright: CopyrightObjectShape.isRequired,
});

const ImageLicenseInfo = ({ image, locale, t }) => {
  const items = getGroupedContributorDescriptionList(image.copyright, locale);

  if (image.title) {
    items.unshift({
      label: t('images.title'),
      description: image.title,
      metaType: metaTypes.title,
    });
  }

  if (image.copyright.origin) {
    items.push({
      label: t('images.source'),
      description: image.copyright.origin,
      metaType: metaTypes.other,
    });
  }

  return (
    <MediaListItem>
      <MediaListItemImage>
        <Image alt={image.altText} src={image.src} />
      </MediaListItemImage>
      <MediaListItemBody
        title={t('images.rules')}
        license={image.copyright.license.license}
        resourceType="image"
        resourceUrl={image.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={getCopyrightCopyString(image.copyright, t)}
              t={t}
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
  image: ImageShape.isRequired,
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
  images: PropTypes.arrayOf(ImageShape),
};

export default injectT(ImageLicenseList, 'license.');
