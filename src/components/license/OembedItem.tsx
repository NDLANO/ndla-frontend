/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { FileCopyLine } from "@ndla/icons/action";
import { Heading, Text } from "@ndla/primitives";
import CopyTextButton from "./CopyTextButton";
import { MediaListContent, MediaList, MediaListItem } from "../MediaList/MediaList";

interface Props {
  oembed: string;
}

const OembedItem = ({ oembed }: Props) => {
  const { t } = useTranslation();
  return (
    <MediaList>
      <MediaListItem>
        <MediaListContent>
          <Heading textStyle="title.small" fontWeight="semibold" asChild consumeCss>
            <h3>{t("license.tabs.embedlink")}</h3>
          </Heading>
          <Text textStyle="body.medium">{t("license.embedlink.description")}</Text>
          <CopyTextButton
            copyTitle={t("license.embedlink.copyTitle")}
            hasCopiedTitle={t("license.embedlink.hasCopiedTitle")}
            stringToCopy={oembed}
          >
            <FileCopyLine />
          </CopyTextButton>
        </MediaListContent>
      </MediaListItem>
    </MediaList>
  );
};

export default OembedItem;
