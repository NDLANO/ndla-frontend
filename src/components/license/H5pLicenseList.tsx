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
import { Copy } from "@ndla/icons/action";
import { Launch } from "@ndla/icons/common";
import { metaTypes, getGroupedContributorDescriptionList, figureApa7CopyString } from "@ndla/licenses";
import { SafeLinkButton } from "@ndla/safelink";
import { uuid } from "@ndla/util";
import CopyTextButton from "./CopyTextButton";
import { licenseListCopyrightFragment } from "./licenseFragments";
import { isCopyrighted, licenseCopyrightToCopyrightType } from "./licenseHelpers";
import { MediaListRef } from "./licenseStyles";
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
} from "../MediaList";

interface H5pLicenseInfoProps {
  h5p: GQLH5pLicenseList_H5pLicenseFragment;
}

const H5pLicenseInfo = ({ h5p }: H5pLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const safeCopyright = licenseCopyrightToCopyrightType(h5p.copyright);
  const pageUrl = useMemo(() => `/h5p/${h5p.id}`, [h5p.id]);

  const shouldShowLink = useMemo(() => pathname !== pageUrl, [pageUrl, pathname]);

  const items: ItemType[] = getGroupedContributorDescriptionList(safeCopyright, i18n.language);
  if (h5p.title) {
    items.unshift({
      label: t("license.images.title"),
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
      <MediaListLicense
        licenseType={h5p.copyright?.license?.license ?? ""}
        title={t("license.h5p.rules")}
        sourceTitle={h5p.title}
        sourceType="h5p"
      />
      {!isCopyrighted(h5p.copyright?.license.license) && (
        <MediaListItemActions>
          <MediaListRef>
            <CopyTextButton
              stringToCopy={`<iframe title="${h5p.title}" aria-label="${h5p.src}" height="400" width="500" frameborder="0" src="${h5p.src}" allowfullscreen=""></iframe>`}
              copyTitle={t("license.embed")}
              hasCopiedTitle={t("license.embedCopied")}
            />
            {shouldShowLink && (
              <SafeLinkButton to={pageUrl} target="_blank" rel="noopener noreferrer" variant="outline">
                <Launch />
                {t("license.openLink")}
              </SafeLinkButton>
            )}
          </MediaListRef>
        </MediaListItemActions>
      )}
      <MediaListItemBody
        license={h5p.copyright?.license?.license ?? ""}
        resourceType="h5p"
        resourceUrl={h5p.src}
        locale={i18n.language}
      >
        <MediaListItemActions>
          <MediaListRef>
            <MediaListItemMeta items={items} />
            {!isCopyrighted(h5p.copyright?.license.license) && (
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
  h5ps: GQLH5pLicenseList_H5pLicenseFragment[];
}

const H5pLicenseList = ({ h5ps }: Props) => {
  const unique = useMemo(() => uniqBy(h5ps, (h5p) => h5p.id), [h5ps]);
  return (
    <MediaList>
      {unique.map((h5p) => (
        <H5pLicenseInfo h5p={h5p} key={uuid()} />
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

export default H5pLicenseList;
