/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import { FileCopyLine, DownloadLine, ExternalLinkLine } from "@ndla/icons";
import { figureApa7CopyString, getGroupedContributorDescriptionList, metaTypes } from "@ndla/licenses";
import { SafeLinkButton } from "@ndla/safelink";
import { uniqBy } from "@ndla/util";
import CopyTextButton from "./CopyTextButton";
import { licenseListCopyrightFragment } from "./licenseFragments";
import { isCopyrighted, licenseCopyrightToCopyrightType } from "./licenseHelpers";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
import config from "../../config";
import { GQLAudioLicenseList_AudioLicenseFragment } from "../../graphqlTypes";
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

interface AudioLicenseInfoProps {
  audio: GQLAudioLicenseList_AudioLicenseFragment;
}

const AudioLicenseInfo = ({ audio }: AudioLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const pageUrl = useMemo(() => `/audio/${audio.id}`, [audio.id]);

  const shouldShowLink = useMemo(() => pathname !== pageUrl, [pathname, pageUrl]);

  const safeCopyright = licenseCopyrightToCopyrightType(audio.copyright);
  const items: ItemType[] = getGroupedContributorDescriptionList(safeCopyright, i18n.language);

  if (audio.title) {
    items.unshift({
      label: t("title"),
      description: audio.title,
      metaType: metaTypes.title,
    });
  }
  if (audio.copyright.origin) {
    items.push({
      label: t("source"),
      description: audio.copyright.origin,
      metaType: metaTypes.other,
    });
  }
  if (audio.copyright.processed === true) {
    items.push({
      label: t("license.processed"),
      metaType: metaTypes.otherWithoutDescription,
    });
  }

  const copyText = figureApa7CopyString(
    audio.title,
    undefined,
    audio.src,
    `${config.ndlaFrontendDomain}/audio/${audio.id}`,
    audio.copyright,
    audio.copyright.license.license,
    "",
    (id: string) => t(id),
    i18n.language,
  );

  return (
    <MediaListItem>
      <MediaListItemBody
        license={audio.copyright.license.license}
        resourceType="audio"
        resourceUrl={audio.src}
        locale={i18n.language}
      >
        <MediaListContent>
          <MediaListLicense
            licenseType={audio.copyright.license.license}
            title={t("license.audio.rules")}
            sourceTitle={audio.title}
            sourceType="audio"
          >
            {!isCopyrighted(audio.copyright.license.license) && (
              <AddResourceToFolderModal
                resource={{
                  id: audio.id,
                  path: `/audio/${audio.id}`,
                  resourceType: "audio",
                }}
              >
                <FavoriteButton path={`/audio/${audio.id}`} />
              </AddResourceToFolderModal>
            )}
          </MediaListLicense>
          {!isCopyrighted(audio.copyright.license.license) && (
            <MediaListItemActions>
              <SafeLinkButton to={audio.src} download variant="secondary" size="small">
                <DownloadLine />
                {t("license.download")}
              </SafeLinkButton>
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
            {!isCopyrighted(audio.copyright.license.license) && !!copyText && (
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
  audios: GQLAudioLicenseList_AudioLicenseFragment[];
}

const AudioLicenseList = ({ audios }: Props) => {
  const unique = useMemo(() => uniqBy(audios, (audio) => audio.id), [audios]);
  return (
    <MediaList>
      {unique.map((audio) => (
        <AudioLicenseInfo audio={audio} key={`audio-${audio.id}`} />
      ))}
    </MediaList>
  );
};

AudioLicenseList.fragments = {
  audio: gql`
    fragment AudioLicenseList_AudioLicense on AudioLicense {
      id
      src
      title
      copyright {
        origin
        ...LicenseListCopyright
      }
    }
    ${licenseListCopyrightFragment}
  `,
};

export default AudioLicenseList;
