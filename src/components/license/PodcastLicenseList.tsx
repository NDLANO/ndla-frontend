/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { gql } from "@apollo/client";
import { FileCopyLine, DownloadLine, ExternalLinkLine } from "@ndla/icons";
import { figureApa7CopyString, getGroupedContributorDescriptionList, metaTypes } from "@ndla/licenses";
import { SafeLinkButton } from "@ndla/safelink";
import CopyTextButton from "./CopyTextButton";
import { licenseListCopyrightFragment } from "./licenseFragments";
import { isCopyrighted, licenseCopyrightToCopyrightType } from "./licenseHelpers";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
import config from "../../config";
import { GQLPodcastLicenseList_PodcastLicenseFragment } from "../../graphqlTypes";
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

interface PodcastLicenseInfoProps {
  podcast: GQLPodcastLicenseList_PodcastLicenseFragment;
}

const PodcastLicenseInfo = ({ podcast }: PodcastLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const pageUrl = useMemo(() => `/audio/${podcast.id}`, [podcast.id]);

  const shouldShowLink = useMemo(() => pathname !== pageUrl, [pageUrl, pathname]);

  const safeCopyright = licenseCopyrightToCopyrightType(podcast.copyright);
  const items: ItemType[] = getGroupedContributorDescriptionList(safeCopyright, i18n.language);

  const copyText = figureApa7CopyString(
    podcast.title,
    undefined,
    podcast.src,
    `${config.ndlaFrontendDomain}/audio/${podcast.id}`,
    podcast.copyright,
    podcast.copyright.license.license,
    "",
    (id: string) => t(id),
    i18n.language,
  );

  if (podcast.title) {
    items.unshift({
      label: t("title"),
      description: podcast.title,
      metaType: metaTypes.title,
    });
  }
  if (podcast.copyright.origin) {
    items.push({
      label: t("source"),
      description: podcast.copyright.origin,
      metaType: metaTypes.other,
    });
  }

  if (podcast.copyright.processed === true) {
    items.push({
      label: t("license.processed"),
      metaType: metaTypes.otherWithoutDescription,
    });
  }

  return (
    <MediaListItem>
      <MediaListItemBody
        license={podcast.copyright.license?.license}
        resourceType="podcast"
        resourceUrl={podcast.src}
        locale={i18n.language}
      >
        <MediaListContent>
          <MediaListLicense
            licenseType={podcast.copyright.license.license}
            title={t("license.podcast.rules")}
            sourceTitle={podcast.title}
            sourceType="podcast"
          >
            {!isCopyrighted(podcast.copyright.license.license) && (
              <AddResourceToFolderModal
                resource={{
                  id: podcast.id,
                  path: `/audio/${podcast.id}`,
                  resourceType: "audio",
                }}
              >
                <FavoriteButton path={`/audio/${podcast.id}`} />
              </AddResourceToFolderModal>
            )}
          </MediaListLicense>
          {!isCopyrighted(podcast.copyright.license.license) && (
            <MediaListItemActions>
              <SafeLinkButton to={podcast.src} download variant="secondary" size="small">
                <DownloadLine />
                {t("license.download")}
              </SafeLinkButton>
              <CopyTextButton
                stringToCopy={`<iframe title="${podcast.title}" aria-label="${podcast.title}" height="400" width="500" frameborder="0" src="${podcast.src}" allowfullscreen=""></iframe>`}
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
            {!isCopyrighted(podcast.copyright.license.license) && !!copyText && (
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
  podcasts: GQLPodcastLicenseList_PodcastLicenseFragment[];
}

const PodcastLicenseList = ({ podcasts }: Props) => {
  return (
    <MediaList>
      {podcasts.map((podcast, index) => (
        <PodcastLicenseInfo podcast={podcast} key={`${podcast.id}-${index}`} />
      ))}
    </MediaList>
  );
};

PodcastLicenseList.fragments = {
  podcast: gql`
    fragment PodcastLicenseList_PodcastLicense on PodcastLicense {
      id
      src
      copyText
      title
      description
      copyright {
        origin
        ...LicenseListCopyright
      }
    }
    ${licenseListCopyrightFragment}
  `,
};

export default PodcastLicenseList;
