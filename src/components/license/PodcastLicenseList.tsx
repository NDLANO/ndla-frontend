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
import { figureApa7CopyString, getGroupedContributorDescriptionList, metaTypes } from "@ndla/licenses";
import { SafeLinkButton } from "@ndla/safelink";
import CopyTextButton from "./CopyTextButton";
import { licenseListCopyrightFragment } from "./licenseFragments";
import { isCopyrighted, licenseCopyrightToCopyrightType } from "./licenseHelpers";
import { MediaListRef } from "./licenseStyles";
import FavoriteButton from "../../components/Article/FavoritesButton";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
import config from "../../config";
import { GQLPodcastLicenseList_PodcastLicenseFragment } from "../../graphqlTypes";
import {
  MediaList,
  MediaListItem,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
  ItemType,
  MediaListLicense,
} from "../MediaList";

interface PodcastLicenseInfoProps {
  podcast: GQLPodcastLicenseList_PodcastLicenseFragment;
}

const LicenseAndButtonWrapper = styled.div`
  display: flex;
  align-items: start;
  gap: ${spacing.xsmall};
`;

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
    `${config.ndlaFrontendDomain}/podcast/${podcast.id}`,
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
      <LicenseAndButtonWrapper>
        <MediaListLicense
          licenseType={podcast.copyright.license.license}
          title={t("license.podcast.rules")}
          sourceTitle={podcast.title}
          sourceType="podcast"
        />
        {!isCopyrighted(podcast.copyright.license.license) && (
          <AddResourceToFolderModal
            resource={{
              id: podcast.id,
              path: `${config.ndlaFrontendDomain}/podcast/${podcast.id}`,
              resourceType: "podcast",
            }}
          >
            <FavoriteButton path={`${config.ndlaFrontendDomain}/podcast/${podcast.id}`} />
          </AddResourceToFolderModal>
        )}
      </LicenseAndButtonWrapper>
      {!isCopyrighted(podcast.copyright.license.license) && (
        <MediaListItemActions>
          <SafeLinkButton to={podcast.src} download variant="outline">
            <Download />
            {t("license.download")}
          </SafeLinkButton>
          <CopyTextButton
            stringToCopy={`<iframe title="${podcast.title}" aria-label="${podcast.title}" height="400" width="500" frameborder="0" src="${podcast.src}" allowfullscreen=""></iframe>`}
            copyTitle={t("license.embed")}
            hasCopiedTitle={t("license.embedCopied")}
          />
          {shouldShowLink && (
            <SafeLinkButton to={pageUrl} target="_blank" variant="outline">
              <Launch />
              {t("license.openLink")}
            </SafeLinkButton>
          )}
        </MediaListItemActions>
      )}
      <MediaListItemBody
        license={podcast.copyright.license?.license}
        resourceType="podcast"
        resourceUrl={podcast.src}
        locale={i18n.language}
      >
        <MediaListItemActions>
          <MediaListRef>
            <MediaListItemMeta items={items} />
            {copyText && !isCopyrighted(podcast.copyright.license.license) && (
              <CopyTextButton
                stringToCopy={copyText}
                copyTitle={t("license.copyTitle")}
                hasCopiedTitle={t("license.hasCopiedTitle")}
              >
                <Copy />
              </CopyTextButton>
            )}
          </MediaListRef>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

interface Props {
  podcasts: GQLPodcastLicenseList_PodcastLicenseFragment[];
}

const PodcastLicenseList = ({ podcasts }: Props) => {
  const unique = useMemo(() => uniqBy(podcasts, (p) => p.id), [podcasts]);

  return (
    <MediaList>
      {unique.map((podcast, index) => (
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
