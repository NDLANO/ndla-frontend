/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import uniqBy from "lodash/uniqBy";
import queryString from "query-string";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Copy } from "@ndla/icons/action";
import { Download, Launch } from "@ndla/icons/common";
import { metaTypes, getGroupedContributorDescriptionList, figureApa7CopyString } from "@ndla/licenses";
import { SafeLinkButton } from "@ndla/safelink";
import { Image } from "@ndla/ui";
import CopyTextButton from "./CopyTextButton";
import { licenseListCopyrightFragment } from "./licenseFragments";
import { isCopyrighted, licenseCopyrightToCopyrightType } from "./licenseHelpers";
import { MediaListRef } from "./licenseStyles";
import FavoriteButton from "../../components/Article/FavoritesButton";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
import config from "../../config";
import { GQLImageLicenseList_ImageLicenseFragment } from "../../graphqlTypes";
import {
  MediaList,
  MediaListItem,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
  ItemType,
  MediaListLicense,
} from "../MediaList";

export const downloadUrl = (imageSrc: string) => {
  const urlObject = queryString.parseUrl(imageSrc);
  return `${urlObject.url}?${queryString.stringify({
    ...urlObject.query,
    download: true,
  })}`;
};

interface ImageLicenseInfoProps {
  image: GQLImageLicenseList_ImageLicenseFragment;
}

const LicenseAndButtonWrapper = styled.div`
  display: flex;
  align-items: start;
  gap: ${spacing.xsmall};
`;

const ImageLicenseInfo = ({ image }: ImageLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const pageUrl = useMemo(() => `/image/${image.id}`, [image.id]);

  const shouldShowLink = useMemo(
    () => pathname !== pageUrl && !isCopyrighted(image.copyright.license.license),
    [pathname, pageUrl, image.copyright.license.license],
  );

  const safeCopyright = licenseCopyrightToCopyrightType(image.copyright);
  const items: ItemType[] = getGroupedContributorDescriptionList(safeCopyright, i18n.language);

  const copyText = figureApa7CopyString(
    image.title,
    undefined,
    image.src,
    `${config.ndlaFrontendDomain}/image/${image.id}`,
    image.copyright,
    image.copyright.license.license,
    "",
    (id: string) => t(id),
    i18n.language,
  );

  if (image.title) {
    items.unshift({
      label: t("license.images.title"),
      description: image.title,
      metaType: metaTypes.title,
    });
  }

  if (image.copyright.origin) {
    items.push({
      label: t("license.images.source"),
      description: image.copyright.origin,
      metaType: metaTypes.other,
    });
  }

  if (image.copyright.processed === true) {
    items.push({
      label: t("license.processed"),
      metaType: metaTypes.otherWithoutDescription,
    });
  }

  return (
    <MediaListItem>
      <LicenseAndButtonWrapper>
        <MediaListLicense
          licenseType={image.copyright.license.license}
          title={t("license.images.rules")}
          sourceTitle={image.title}
        />
        {!isCopyrighted(image.copyright.license.license) && (
          <AddResourceToFolderModal
            resource={{
              id: image.id,
              path: `${config.ndlaFrontendDomain}/image/${image.id}`,
              resourceType: "image",
            }}
          >
            <FavoriteButton path={`${config.ndlaFrontendDomain}/image/${image.id}`} />
          </AddResourceToFolderModal>
        )}
      </LicenseAndButtonWrapper>
      <Image alt={image.altText} src={image.src} />
      {!isCopyrighted(image.copyright.license.license) && (
        <MediaListItemActions>
          {image.src && (
            <>
              <SafeLinkButton to={downloadUrl(image.src)} variant="outline" download>
                <Download />
                {t("license.download")}
              </SafeLinkButton>
              <CopyTextButton
                stringToCopy={`<iframe title="${image.title}" aria-label="${image.title}" height="400" width="500" frameborder="0" src="${image.src}" allowfullscreen=""></iframe>`}
                copyTitle={t("license.embed")}
                hasCopiedTitle={t("license.embedCopied")}
              />
            </>
          )}
          {shouldShowLink && (
            <SafeLinkButton to={pageUrl} target="_blank" variant="outline">
              <Launch />
              {t("license.openLink")}
            </SafeLinkButton>
          )}
        </MediaListItemActions>
      )}
      <MediaListItemBody
        license={image.copyright.license?.license}
        resourceType="image"
        resourceUrl={image.src}
        locale={i18n.language}
      >
        <MediaListItemActions>
          <MediaListRef>
            <MediaListItemMeta items={items} />
            {!isCopyrighted(image.copyright.license.license) && (
              <>
                {copyText && (
                  <CopyTextButton
                    stringToCopy={copyText}
                    copyTitle={t("license.copyTitle")}
                    hasCopiedTitle={t("license.hasCopiedTitle")}
                  >
                    <Copy />
                  </CopyTextButton>
                )}
              </>
            )}
          </MediaListRef>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

interface Props {
  images: GQLImageLicenseList_ImageLicenseFragment[];
}

const ImageLicenseList = ({ images }: Props) => {
  const unique = useMemo(() => uniqBy(images, (image) => image.id), [images]);
  return (
    <MediaList>
      {unique.map((image, index) => (
        <ImageLicenseInfo image={image} key={`${image.id}-${index}`} />
      ))}
    </MediaList>
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
