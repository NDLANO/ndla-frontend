/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
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
import { GQLImageLicense } from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import { licenseCopyrightToCopyrightType } from './licenseHelpers';

export const downloadUrl = (imageSrc: string) => {
  const urlObject = queryString.parseUrl(imageSrc);
  return `${urlObject.url}?${queryString.stringify({
    ...urlObject.query,
    download: true,
  })}`;
};

interface ImageLicenseInfoProps {
  image: GQLImageLicense;
  locale: LocaleType;
}

const ImageLicenseInfo = ({ image, locale }: ImageLicenseInfoProps) => {
  const { t } = useTranslation();
  const safeCopyright = licenseCopyrightToCopyrightType(image.copyright);
  const items = getGroupedContributorDescriptionList(safeCopyright, locale);

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
        license={image.copyright.license?.license}
        resourceType="image"
        resourceUrl={image.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={image.copyText}
              copyTitle={t('license.copyTitle')}
              hasCopiedTitle={t('license.hasCopiedTitle')}
            />
            {image.copyright.license?.license !== 'COPYRIGHTED' && (
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

interface Props {
  images: GQLImageLicense[];
  locale: LocaleType;
}

const ImageLicenseList = ({ images, locale }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('license.images.heading')}</h2>
      <p>{t('license.images.description')}</p>
      <MediaList>
        {images.map(image => (
          <ImageLicenseInfo image={image} key={uuid()} locale={locale} />
        ))}
      </MediaList>
    </div>
  );
};

export default ImageLicenseList;
