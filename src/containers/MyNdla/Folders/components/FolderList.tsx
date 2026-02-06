/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Text } from "@ndla/primitives";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BlockWrapper } from "../../../../components/MyNdla/BlockWrapper";
import { PageSpinner } from "../../../../components/PageSpinner";
import { WhileLoading } from "../../../../components/WhileLoading";
import { GQLFolder, GQLSharedFolder } from "../../../../graphqlTypes";
import { FolderTotalCount, getTotalCountForFolder } from "../../../../util/folderHelpers";
import { folderId, sharedFolderId } from "../util";
import { FolderWithMenu } from "./FolderWithMenu";

interface Props {
  loading: boolean;
  folders: GQLFolder[];
  folderId: string | undefined;
  isFavorited?: boolean;
  labelledBy: string;
}

export const getFolderCount = (folders: GQLFolder[] | GQLSharedFolder[]) =>
  folders.reduce<Record<string, FolderTotalCount>>((acc, curr) => {
    acc[curr.id] = getTotalCountForFolder(curr);
    return acc;
  }, {});

export const FolderList = ({ loading, folders, isFavorited, labelledBy }: Props) => {
  const { t } = useTranslation();
  const foldersCount = useMemo(() => getFolderCount(folders), [folders]);

  return (
    <WhileLoading isLoading={loading} fallback={<PageSpinner />}>
      {folders.length ? (
        <BlockWrapper aria-labelledby={labelledBy}>
          {folders.map((folder) => (
            <FolderWithMenu
              key={isFavorited ? sharedFolderId(folder.id) : folderId(folder.id)}
              folder={folder}
              foldersCount={foldersCount?.[folder.id]}
              isFavorited={isFavorited}
            />
          ))}
        </BlockWrapper>
      ) : (
        <Text>{isFavorited ? t("myNdla.folder.noSharedFolders") : t("myNdla.folder.noFolders")}</Text>
      )}
    </WhileLoading>
  );
};
