/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { FileCopyLine } from "@ndla/icons";
import { metaTypes, getGroupedContributorDescriptionList } from "@ndla/licenses";
import { Button } from "@ndla/primitives";
import { printPage } from "@ndla/util";
import CopyTextButton from "./CopyTextButton";
import { licenseListCopyrightFragment } from "./licenseFragments";
import { isCopyrighted, licenseCopyrightToCopyrightType } from "./licenseHelpers";
import { GQLTextLicenseList_CopyrightFragment } from "../../graphqlTypes";
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

interface TextLicenseInfoProps {
  text: TextItem;
  printUrl?: string;
}
const TextLicenseInfo = ({ text, printUrl }: TextLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const safeCopyright = licenseCopyrightToCopyrightType(text.copyright);

  const items: ItemType[] = getGroupedContributorDescriptionList(
    safeCopyright,
    i18n.language === "se" ? "nb" : i18n.language,
  );
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
      label: t("source"),
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
      <MediaListItemBody license={text.copyright.license?.license} resourceType="text" locale={i18n.language}>
        <MediaListContent>
          <MediaListLicense
            licenseType={text.copyright.license.license}
            title={t("license.text.rules")}
            sourceTitle={text.title}
            sourceType="text"
          />
          {!!printUrl && (
            <MediaListItemActions>
              <Button variant="secondary" onClick={() => printPage(printUrl)} size="small">
                {t("article.printPage")}
              </Button>
            </MediaListItemActions>
          )}
        </MediaListContent>
        <MediaListItemActions>
          <MediaListContent>
            <MediaListItemMeta items={items} />
            {!isCopyrighted(text.copyright.license?.license) && !!text.copyText && (
              <CopyTextButton
                stringToCopy={text.copyText}
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
  return (
    <MediaList>
      {texts.map((text, index) => (
        <TextLicenseInfo text={text} key={index} printUrl={printUrl} />
      ))}
    </MediaList>
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
