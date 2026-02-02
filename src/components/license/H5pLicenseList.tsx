/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { ExternalLinkLine } from "@ndla/icons";
import { metaTypes, figureApa7CopyString } from "@ndla/licenses";
import { SafeLinkButton } from "@ndla/safelink";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import config from "../../config";
import { GQLH5pLicenseList_H5pLicenseFragment } from "../../graphqlTypes";
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
import { CopyBlock } from "./CopyBlock";
import { CopyTextButton } from "./CopyTextButton";
import { licenseListCopyrightFragment } from "./licenseFragments";
import { getGroupedContributorDescriptionList, isCopyrighted } from "./licenseHelpers";

interface H5pLicenseInfoProps {
  h5p: GQLH5pLicenseList_H5pLicenseFragment;
}

const H5pLicenseInfo = ({ h5p }: H5pLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const pageUrl = useMemo(() => `/h5p/${h5p.id}`, [h5p.id]);

  const shouldShowLink = useMemo(() => pathname !== pageUrl, [pageUrl, pathname]);

  const items: ItemType[] = getGroupedContributorDescriptionList(h5p.copyright, t);
  if (h5p.title) {
    items.unshift({
      label: t("title"),
      description: h5p.title,
      metaType: metaTypes.title,
    });
  }

  const copyText = figureApa7CopyString(
    h5p.title,
    undefined,
    h5p.src,
    `${config.ndlaFrontendDomain}/h5p/${h5p.id}`,
    h5p.copyright,
    h5p?.copyright?.license.license,
    "",
    (id: string) => t(id),
    i18n.language,
  );

  return (
    <MediaListItem>
      <MediaListItemBody
        license={h5p.copyright?.license?.license ?? ""}
        resourceType="h5p"
        resourceUrl={h5p.src}
        locale={i18n.language}
      >
        <MediaListContent>
          <MediaListLicense
            licenseType={h5p.copyright?.license?.license ?? ""}
            title={t("license.h5p.rules")}
            sourceTitle={h5p.title}
            sourceType="h5p"
          />
          {!isCopyrighted(h5p.copyright?.license.license) && (
            <MediaListItemActions>
              <CopyTextButton
                stringToCopy={`<iframe title="${h5p.title}" aria-label="${h5p.src}" height="400" width="500" style="border: none;" allowfullscreen="" src="${h5p.src}"></iframe>`}
                copyTitle={t("license.embed")}
                hasCopiedTitle={t("license.embedCopied")}
              />
              {!!shouldShowLink && (
                <SafeLinkButton to={pageUrl} target="_blank" rel="noopener noreferrer" variant="secondary" size="small">
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
            <CopyBlock stringToCopy={copyText} license={h5p.copyright?.license.license} />
          </MediaListContent>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

interface Props {
  h5ps: GQLH5pLicenseList_H5pLicenseFragment[];
}

export const H5pLicenseList = ({ h5ps }: Props) => {
  return (
    <MediaList>
      {h5ps.map((h5p) => (
        <H5pLicenseInfo h5p={h5p} key={`h5p-${h5p.id}`} />
      ))}
    </MediaList>
  );
};

H5pLicenseList.fragments = {
  h5p: gql`
    fragment H5pLicenseList_H5pLicense on H5pLicense {
      id
      title
      src
      copyright {
        ...LicenseListCopyright
      }
    }
    ${licenseListCopyrightFragment}
  `,
};
