/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import { uuid } from '@ndla/util';
import {
  Image,
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
} from '@ndla/ui';
import {
  metaTypes,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import CopyTextButton from './CopyTextButton';
import AnchorButton from './AnchorButton';
import { ImageShape } from '../../shapes';

export const downloadUrl = imageSrc => {
  const urlObject = queryString.parseUrl(imageSrc);
  return `${urlObject.url}?${queryString.stringify({
    ...urlObject.query,
    download: true,
  })}`;
};

const ImageLicenseInfo = ({ image, locale }) => {
  const { t } = useTranslation();
  const items = getGroupedContributorDescriptionList(image.copyright, locale);

  if (image.title) {
    items.unshift({
      label: t('license.images.title'),
      description: image.title,
      metaType: metaTypes.title,
    });
  }

  if (image.copyright.origin) {
    items.push({
      label: t('license.images.source'),
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
        title={t('license.images.rules')}
        license={image.copyright.license.license}
        resourceType="image"
        resourceUrl={image.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={image.copyText}
              t={t}
              copyTitle={t('license.copyTitle')}
              hasCopiedTitle={t('license.hasCopiedTitle')}
            />
            {image.copyright.license.license !== 'COPYRIGHTED' && (
              <AnchorButton
                href={downloadUrl(image.src)}
                appearance="outline"
                download>
                {t('license.download')}
              </AnchorButton>
            )}
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

const ImageLicenseList = ({ images, locale }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('license.images.heading')}</h2>
      <p>{t('license.images.description')}</p>
      <MediaList>
        {images.map(image => (
          <ImageLicenseInfo image={image} key={uuid()} locale={locale} t={t} />
        ))}
      </MediaList>
    </div>
  );
};

ImageLicenseList.propTypes = {
  locale: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(ImageShape),
};

export default ImageLicenseList;
