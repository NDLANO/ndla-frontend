/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import uniqBy from "lodash/uniqBy";
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
import { uuid } from "@ndla/util";
import CopyTextButton from "./CopyTextButton";
import { licenseListCopyrightFragment } from "./licenseFragments";
import { isCopyrighted, licenseCopyrightToCopyrightType } from "./licenseHelpers";
import { MediaListRef } from "./licenseStyles";
import FavoriteButton from "../../components/Article/FavoritesButton";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
import config from "../../config";
import { GQLVideoLicenseList_BrightcoveLicenseFragment } from "../../graphqlTypes";
import {
  MediaList,
  MediaListItem,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
  ItemType,
  MediaListLicense,
} from "../MediaList";

interface VideoLicenseInfoProps {
  video: GQLVideoLicenseList_BrightcoveLicenseFragment;
}

const LicenseAndButtonWrapper = styled.div`
  display: flex;
  align-items: start;
  gap: ${spacing.xsmall};
`;

const VideoLicenseInfo = ({ video }: VideoLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const pageUrl = useMemo(() => `/video/${video.id}`, [video.id]);

  const shouldShowLink = useMemo(() => pathname !== pageUrl, [pageUrl, pathname]);

  const safeCopyright = licenseCopyrightToCopyrightType(video.copyright);
  const items: ItemType[] = getGroupedContributorDescriptionList(safeCopyright, i18n.language);
  if (video.title) {
    items.unshift({
      label: t("license.images.title"),
      description: video.title,
      metaType: metaTypes.title,
    });
  }

  const copyText = figureApa7CopyString(
    video.title,
    undefined,
    video.src,
    `${config.ndlaFrontendDomain}/video/${video.id}`,
    video.copyright,
    video?.copyright?.license.license,
    "",
    (id: string) => t(id),
    i18n.language,
  );

  return (
    <MediaListItem>
      <LicenseAndButtonWrapper>
        <MediaListLicense
          licenseType={video.copyright?.license?.license ?? ""}
          title={t("license.video.rules")}
          sourceTitle={video.title}
          sourceType="video"
        />
        {!isCopyrighted(video.copyright?.license.license) && (
          <AddResourceToFolderModal
            resource={{
              id: video.id,
              path: `${config.ndlaFrontendDomain}/video/${video.id}`,
              resourceType: "video",
            }}
          >
            <FavoriteButton path={`${config.ndlaFrontendDomain}/video/${video.id}`} />
          </AddResourceToFolderModal>
        )}
      </LicenseAndButtonWrapper>
      <img alt="presentation" src={video.cover} />
      {!isCopyrighted(video.copyright?.license.license) && (
        <MediaListItemActions>
          <MediaListRef>
            {video.download && (
              <SafeLinkButton to={video.download} download variant="outline">
                <Download />
                {t("license.download")}
              </SafeLinkButton>
            )}
            <CopyTextButton
              stringToCopy={`<iframe title="${video.title}" height="${video.iframe?.height}" aria-label="${video.title}" width="${video.iframe?.width}" frameborder="0" src="${video.iframe?.src}" allowfullscreen=""></iframe>`}
              copyTitle={t("license.embed")}
              hasCopiedTitle={t("license.embedCopied")}
            />
            {shouldShowLink && (
              <SafeLinkButton to={pageUrl} target="_blank" variant="outline">
                <Launch />
                {t("license.openLink")}
              </SafeLinkButton>
            )}
          </MediaListRef>
        </MediaListItemActions>
      )}
      <MediaListItemBody
        license={video.copyright?.license?.license ?? ""}
        resourceType="video"
        resourceUrl={video.src}
        locale={i18n.language}
      >
        <MediaListItemActions>
          <MediaListRef>
            <MediaListItemMeta items={items} />
            {!isCopyrighted(video.copyright?.license.license) && (
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
  videos: GQLVideoLicenseList_BrightcoveLicenseFragment[];
}

const VideoLicenseList = ({ videos }: Props) => {
  const unique = useMemo(() => uniqBy(videos, (video) => video.id), [videos]);
  return (
    <MediaList>
      {unique.map((video) => (
        <VideoLicenseInfo video={video} key={uuid()} />
      ))}
    </MediaList>
  );
};

VideoLicenseList.fragments = {
  video: gql`
    fragment VideoLicenseList_BrightcoveLicense on BrightcoveLicense {
      id
      title
      download
      src
      cover
      iframe {
        width
        height
        src
      }
      copyright {
        ...LicenseListCopyright
      }
    }
    ${licenseListCopyrightFragment}
  `,
};

export default VideoLicenseList;
