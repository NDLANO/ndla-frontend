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
import { metaTypes, getGroupedContributorDescriptionList, figureApa7CopyString } from "@ndla/licenses";
import { SafeLinkButton } from "@ndla/safelink";
import { Image } from "@ndla/ui";
import CopyTextButton from "./CopyTextButton";
import { licenseListCopyrightFragment } from "./licenseFragments";
import { isCopyrighted, licenseCopyrightToCopyrightType } from "./licenseHelpers";
import { MediaListRef } from "./licenseStyles";
import config from "../../config";
import { GQLImageLicenseList_ImageLicenseFragment } from "../../graphqlTypes";
import {
  MediaList,
  MediaListItem,
  MediaListItemImage,
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
      <MediaListLicense mediaSource={image} title={t("license.images.rules")} mediaSourceTitle={image.title} />
      <MediaListItemImage canOpen={shouldShowLink}>
        <Image alt={image.altText} src={image.src} />
      </MediaListItemImage>
      <MediaListItemActions>
        {image.copyright.license?.license !== "COPYRIGHTED" && (
          <>
            <SafeLinkButton to={downloadUrl(image.src)} variant="outline" download>
              {t("license.download")}
            </SafeLinkButton>
            {shouldShowLink && (
              <SafeLinkButton to={pageUrl} target="_blank" variant="outline">
                {"Åpne i ny fane"}
                {/* Legge til i locale */}
              </SafeLinkButton>
            )}
          </>
        )}
      </MediaListItemActions>
      <MediaListItemBody
        license={image.copyright.license?.license}
        resourceType="image"
        resourceUrl={image.src}
        locale={i18n.language}
      >
        <MediaListItemActions>
          <MediaListRef>
            <MediaListItemMeta items={items} />
            {image.copyright.license?.license !== "COPYRIGHTED" && (
              <>
                {copyText && (
                  <CopyTextButton
                    stringToCopy={copyText}
                    copyTitle={t("license.copyTitle")} //oppdatere locale
                    hasCopiedTitle={t("license.hasCopiedTitle")}
                  />
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
    <div>
      <MediaList>
        {unique.map((image, index) => (
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
