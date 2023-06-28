/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
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
  figureApa7CopyString,
} from '@ndla/licenses';
import { SafeLinkButton } from '@ndla/safelink';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import CopyTextButton from './CopyTextButton';
import { GQLImageLicenseList_ImageLicenseFragment } from '../../graphqlTypes';
import {
  isCopyrighted,
  licenseCopyrightToCopyrightType,
} from './licenseHelpers';
import { licenseListCopyrightFragment } from './licenseFragments';
import config from '../../config';
import LicenseDescription from './LicenseDescription';

export const downloadUrl = (imageSrc: string) => {
  const urlObject = queryString.parseUrl(imageSrc);
  return `${urlObject.url}?${queryString.stringify({
    ...urlObject.query,
    download: true,
  })}`;
};

const StyledLink = styled(Link)`
  ::before {
    z-index: 1;
  }
`;

interface ImageLicenseInfoProps {
  image: GQLImageLicenseList_ImageLicenseFragment;
}

const ImageLicenseInfo = ({ image }: ImageLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const safeCopyright = licenseCopyrightToCopyrightType(image.copyright);
  const items = getGroupedContributorDescriptionList(
    safeCopyright,
    i18n.language,
  );

  const copyText = figureApa7CopyString(
    image.title,
    undefined,
    image.src,
    `${config.ndlaFrontendDomain}/image/${image.id}`,
    image.copyright,
    image.copyright.license.license,
    '',
    (id: string) => t(id),
    i18n.language,
  );

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
      <MediaListItemImage
        canOpen={!isCopyrighted(image.copyright.license.license)}
      >
        {isCopyrighted(image.copyright.license.license) ? (
          <Image alt={image.altText} src={image.src} />
        ) : (
          <StyledLink
            to={`/image/${image.id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('embed.goTo', { type: t('embed.type.image') })}
          >
            <Image alt={image.altText} src={image.src} />
          </StyledLink>
        )}
      </MediaListItemImage>
      <MediaListItemBody
        title={t('license.images.rules')}
        license={image.copyright.license?.license}
        resourceType="image"
        resourceUrl={image.src}
        locale={i18n.language}
      >
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            {image.copyright.license?.license !== 'COPYRIGHTED' && (
              <>
                {copyText && (
                  <CopyTextButton
                    stringToCopy={copyText}
                    copyTitle={t('license.copyTitle')}
                    hasCopiedTitle={t('license.hasCopiedTitle')}
                  />
                )}
                <SafeLinkButton
                  to={downloadUrl(image.src)}
                  variant="outline"
                  download
                >
                  {t('license.download')}
                </SafeLinkButton>
              </>
            )}
          </div>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

interface Props {
  images: GQLImageLicenseList_ImageLicenseFragment[];
}

const ImageLicenseList = ({ images }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <LicenseDescription>{t('license.images.description')}</LicenseDescription>
      <MediaList>
        {images.map((image, index) => (
          <ImageLicenseInfo image={image} key={`${image.id}-${index}`} />
        ))}
      </MediaList>
    </div>
  );
};

ImageLicenseList.fragments = {
  image: gql`
    fragment ImageLicenseList_ImageLicense on ImageLicense {
      id
      title
      altText
      src
      copyText
      copyright {
        origin
        ...LicenseListCopyright
      }
    }
    ${licenseListCopyrightFragment}
  `,
};

export default ImageLicenseList;
