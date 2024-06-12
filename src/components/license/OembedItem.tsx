/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { fonts, spacing } from "@ndla/core";
import { Copy } from "@ndla/icons/action";
import { Text } from "@ndla/typography";
import CopyTextButton from "./CopyTextButton";
import LicenseDescription from "./LicenseDescription";
import { MediaList, MediaListItem } from "../MediaList";

interface Props {
  oembed: string;
}

const BodyTitle = styled(Text)`
  font-weight: ${fonts.weight.bold};
  margin-bottom: 0;
  + p {
    margin-top: ${spacing.small};
  }
`;

const OembedItem = ({ oembed }: Props) => {
  const { t } = useTranslation();
  return (
    <MediaList>
      <MediaListItem>
        <BodyTitle textStyle="meta-text-medium">{t("license.tabs.embedlink")}</BodyTitle>
        <LicenseDescription>{t("license.embedlink.description")}</LicenseDescription>
        <CopyTextButton
          copyTitle={t("license.embedlink.copyTitle")}
          hasCopiedTitle={t("license.embedlink.hasCopiedTitle")}
          stringToCopy={oembed}
        >
          <Copy />
        </CopyTextButton>
      </MediaListItem>
    </MediaList>
  );
};

export default OembedItem;
