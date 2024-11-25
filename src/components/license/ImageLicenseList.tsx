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
import { FileCopyLine } from "@ndla/icons/action";
import { DownloadLine, ExternalLinkLine } from "@ndla/icons/common";
import { metaTypes, getGroupedContributorDescriptionList, figureApa7CopyString } from "@ndla/licenses";
import { Image } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import CopyTextButton from "./CopyTextButton";
import { licenseListCopyrightFragment } from "./licenseFragments";
import { isCopyrighted, licenseCopyrightToCopyrightType } from "./licenseHelpers";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
import config from "../../config";
import { GQLImageLicenseList_ImageLicenseFragment } from "../../graphqlTypes";
import FavoriteButton from "../Article/FavoritesButton";
import {
  MediaList,
  MediaListItem,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
  ItemType,
  MediaListLicense,
  MediaListContent,
} from "../MediaList/MediaList";

export const downloadUrl = (imageSrc: string) => {
  const urlObject = queryString.parseUrl(imageSrc);
  return `${urlObject.url}?${queryString.stringify({
    ...urlObject.query,
    download: true,
  })}`;
};

interface ImageLicenseInfoProps {
  image: GQLImageLicenseList_ImageLicenseFragment;
  isResourcePage?: boolean;
}

const ImageLicenseInfo = ({ image, isResourcePage }: ImageLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const pageUrl = useMemo(() => `/image/${image.id}`, [image.id]);

  const shouldShowLink = useMemo(() => pathname !== pageUrl, [pathname, pageUrl]);

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
      label: t("title"),
      description: image.title,
      metaType: metaTypes.title,
    });
  }

  if (image.copyright.origin) {
    items.push({
      label: t("source"),
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
      <MediaListItemBody
        license={image.copyright.license?.license}
        resourceType="image"
        resourceUrl={image.src}
        locale={i18n.language}
      >
        <MediaListContent>
          <MediaListLicense
            licenseType={image.copyright.license.license}
            title={t("license.images.rules")}
            sourceTitle={image.title}
            sourceType="images"
          >
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
          </MediaListLicense>
          {!isResourcePage && <Image alt={image.altText} src={image.src} fallbackWidth={300} />}
          {!isCopyrighted(image.copyright.license.license) && (
            <MediaListItemActions>
              <SafeLinkButton to={downloadUrl(image.src)} variant="secondary" download size="small">
                <DownloadLine />
                {t("license.download")}
              </SafeLinkButton>
              <CopyTextButton
                stringToCopy={`<iframe title="${image.title}" aria-label="${image.title}" height="400" width="500" frameborder="0" src="${image.src}" allowfullscreen=""></iframe>`}
                copyTitle={t("license.embed")}
                hasCopiedTitle={t("license.embedCopied")}
              />
              {!!shouldShowLink && (
                <SafeLinkButton to={pageUrl} target="_blank" variant="secondary" rel="noopener noreferrer" size="small">
                  <ExternalLinkLine />
                  {t("license.openLink")}
                </SafeLinkButton>
              )}
            </MediaListItemActions>
          )}
        </MediaListContent>
        <MediaListItemActions>
          <MediaListContent>
            <MediaListItemMeta items={items} />
            {!isCopyrighted(image.copyright.license.license) && !!copyText && (
              <CopyTextButton
                stringToCopy={copyText}
                copyTitle={t("license.copyTitle")}
                hasCopiedTitle={t("license.hasCopiedTitle")}
              >
                <FileCopyLine />
              </CopyTextButton>
            )}
          </MediaListContent>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

interface Props {
  images: GQLImageLicenseList_ImageLicenseFragment[];
  isResourcePage?: boolean;
}

const ImageLicenseList = ({ images, isResourcePage }: Props) => {
  const unique = useMemo(() => uniqBy(images, (image) => image.id), [images]);
  return (
    <MediaList>
      {unique.map((image, index) => (
        <ImageLicenseInfo image={image} key={`${image.id}-${index}`} isResourcePage={isResourcePage} />
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
