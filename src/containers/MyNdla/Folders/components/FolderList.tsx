/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Text } from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { BlockWrapper } from "../../../../components/MyNdla/BlockWrapper";
import { GQLFolder } from "../../../../graphqlTypes";
import { folderId, sharedFolderId } from "../util";
import { FolderWithMenu } from "./FolderWithMenu";

interface Props {
  folders: GQLFolder[];
  isFavorited?: boolean;
  labelledBy: string;
}

export const FolderList = ({ folders, isFavorited, labelledBy }: Props) => {
  const { t } = useTranslation();

  return folders.length ? (
    <BlockWrapper aria-labelledby={labelledBy}>
      {folders.map((folder) => (
        <FolderWithMenu
          key={isFavorited ? sharedFolderId(folder.id) : folderId(folder.id)}
          folder={folder}
          isFavorited={isFavorited}
        />
      ))}
    </BlockWrapper>
  ) : (
    <Text>{isFavorited ? t("myNdla.folder.noSharedFolders") : t("myNdla.folder.noFolders")}</Text>
  );
};
