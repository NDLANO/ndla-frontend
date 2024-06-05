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
import { figureApa7CopyString, getGroupedContributorDescriptionList, metaTypes } from "@ndla/licenses";
import { SafeLinkButton } from "@ndla/safelink";
import CopyTextButton from "./CopyTextButton";
import { licenseListCopyrightFragment } from "./licenseFragments";
import { isCopyrighted, licenseCopyrightToCopyrightType } from "./licenseHelpers";
import { MediaListRef } from "./licenseStyles";
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

const PodcastLicenseInfo = ({ podcast }: PodcastLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const pageUrl = useMemo(() => `/audio/${podcast.id}`, [podcast.id]);

  const shouldShowLink = useMemo(
    () => pathname !== pageUrl && !isCopyrighted(podcast.copyright.license.license),
    [pageUrl, pathname, podcast.copyright.license.license],
  );

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
      <MediaListLicense
        licenseType={podcast.copyright.license.license}
        title={t("license.podcast.rules")}
        sourceTitle={podcast.title}
      />
      <MediaListItemActions>
        {podcast.copyright.license?.license !== "COPYRIGHTED" && (
          <>
            {copyText && (
              <CopyTextButton
                stringToCopy={copyText}
                copyTitle={t("license.copyTitle")}
                hasCopiedTitle={t("license.hasCopiedTitle")}
              />
            )}
            <SafeLinkButton to={podcast.src} download variant="outline">
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
        license={podcast.copyright.license?.license}
        resourceType="podcast"
        resourceUrl={podcast.src}
        locale={i18n.language}
      >
        <MediaListItemActions>
          <MediaListRef>
            <MediaListItemMeta items={items} />
            {podcast.copyright.license?.license !== "COPYRIGHTED" && (
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
