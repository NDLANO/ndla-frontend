/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { ButtonV2 } from "@ndla/button";
import { FileDocumentOutline } from "@ndla/icons/common";
import { metaTypes, getGroupedContributorDescriptionList } from "@ndla/licenses";
import {
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
} from "@ndla/ui";
import type { ItemType } from "@ndla/ui";
import { printPage } from "@ndla/util";
import CopyTextButton from "./CopyTextButton";
import LicenseDescription from "./LicenseDescription";
import { licenseListCopyrightFragment } from "./licenseFragments";
import { licenseCopyrightToCopyrightType } from "./licenseHelpers";
import { MediaListRef, mediaListIcon } from "./licenseStyles";
import { GQLTextLicenseList_CopyrightFragment } from "../../graphqlTypes";

interface TextLicenseInfoProps {
  text: TextItem;
}
const TextLicenseInfo = ({ text }: TextLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const safeCopyright = licenseCopyrightToCopyrightType(text.copyright);
  const items: ItemType[] = getGroupedContributorDescriptionList(safeCopyright, i18n.language);
  if (text.title) {
    items.unshift({
      label: t("title"),
      description: text.title,
      metaType: metaTypes.other,
    });
  }
  if (text.updated) {
    items.push({
      label: t("article.lastUpdated"),
      description: text.updated,
      metaType: metaTypes.other,
    });
  }

  if (text.copyright.origin) {
    items.push({
      label: t("license.source"),
      description: text.copyright.origin,
      metaType: metaTypes.other,
    });
  }

  if (text.copyright.processed === true) {
    items.push({
      label: t("license.processed"),
      metaType: metaTypes.otherWithoutDescription,
    });
  }

  return (
    <MediaListItem>
      <MediaListItemImage>
        <FileDocumentOutline css={mediaListIcon} />
      </MediaListItemImage>
      <MediaListItemBody
        license={text.copyright.license?.license}
        title={t("license.text.rules")}
        resourceType="text"
        locale={i18n.language}
      >
        <MediaListItemActions>
          <MediaListRef>
            <MediaListItemMeta items={items} />
            {text.copyText && (
              <CopyTextButton
                stringToCopy={text.copyText}
                copyTitle={t("license.copyTitle")}
                hasCopiedTitle={t("license.hasCopiedTitle")}
              />
            )}
          </MediaListRef>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

export interface TextItem {
  copyright: GQLTextLicenseList_CopyrightFragment;
  updated?: string;
  copyText?: string;
  title?: string;
}

interface Props {
  texts: TextItem[];
  printUrl?: string;
}

const TextLicenseList = ({ texts, printUrl }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <LicenseDescription>{t("license.text.description")}</LicenseDescription>
      {printUrl && (
        <ButtonV2 variant="outline" onClick={() => printPage(printUrl)}>
          {t("article.printPage")}
        </ButtonV2>
      )}
      <MediaList>
        {texts.map((text, index) => (
          <TextLicenseInfo text={text} key={index} />
        ))}
      </MediaList>
    </div>
  );
};

TextLicenseList.fragments = {
  copyright: gql`
    fragment TextLicenseList_Copyright on Copyright {
      ...LicenseListCopyright
    }
    ${licenseListCopyrightFragment}
  `,
};

export default TextLicenseList;
