/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { ExternalLinkLine } from "@ndla/icons";
import { metaTypes } from "@ndla/licenses";
import { Button } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useTranslation } from "react-i18next";
import { GQLTextLicenseList_CopyrightFragment } from "../../graphqlTypes";
import { toRevisions } from "../../routeHelpers";
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
import { licenseListCopyrightFragment } from "./licenseFragments";
import { getGroupedContributorDescriptionList } from "./licenseHelpers";

interface TextLicenseInfoProps {
  text: TextItem;
  articleId: number;
}

const StyledSafeLink = styled(SafeLink, {
  base: {
    display: "flex",
    gap: "xxsmall",
    color: "text.link",
    textDecoration: "underline",
    width: "fit-content",
    _hover: {
      textDecoration: "none",
    },
  },
});

const TextLicenseInfo = ({ text, articleId }: TextLicenseInfoProps) => {
  const { t, i18n } = useTranslation();

  const items: ItemType[] = getGroupedContributorDescriptionList(text.copyright, t);
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
          <MediaListItemActions>
            <Button variant="secondary" onClick={() => window.print()} size="small">
              {t("article.printPage")}
            </Button>
          </MediaListItemActions>
        </MediaListContent>
        <MediaListItemActions>
          <MediaListContent>
            <MediaListItemMeta items={items} />
            {!!articleId && (
              <StyledSafeLink to={toRevisions(articleId)} target="_blank" rel="noopener noreferrer">
                {t("revision.viewPreviousRevisions")}
                <ExternalLinkLine />
              </StyledSafeLink>
            )}
            <CopyBlock stringToCopy={text.copyText} license={text.copyright.license.license} />
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
  articleId: number;
}

export const TextLicenseList = ({ texts, articleId }: Props) => {
  return (
    <MediaList>
      {texts.map((text, index) => (
        <TextLicenseInfo text={text} key={index} articleId={articleId} />
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
