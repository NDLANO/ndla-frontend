/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, SetStateAction, Dispatch } from "react";
import { BlockWrapper } from "../../../../components/MyNdla/BlockWrapper";
import { PageSpinner } from "../../../../components/PageSpinner";
import { WhileLoading } from "../../../../components/WhileLoading";
import { GQLFolder, GQLSharedFolder } from "../../../../graphqlTypes";
import { FolderTotalCount, getTotalCountForFolder } from "../../../../util/folderHelpers";
import { FolderWithMenu } from "./FolderWithMenu";

interface Props {
  loading: boolean;
  folders: GQLFolder[];
  folderId: string | undefined;
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  folderRefId?: string;
  isFavorited?: boolean;
  labelledBy: string;
}

export const getFolderCount = (folders: GQLFolder[] | GQLSharedFolder[]) =>
  folders.reduce<Record<string, FolderTotalCount>>((acc, curr) => {
    acc[curr.id] = getTotalCountForFolder(curr);
    return acc;
  }, {});

export const FolderList = ({ loading, folders, setFocusId, folderRefId, isFavorited, labelledBy }: Props) => {
  const foldersCount = useMemo(() => getFolderCount(folders), [folders]);

  return (
    <WhileLoading isLoading={loading} fallback={<PageSpinner />}>
      {!!folders.length && (
        <BlockWrapper aria-labelledby={labelledBy}>
          {folders.map((folder) => (
            <FolderWithMenu
              key={`folder-${folder.id}`}
              folder={folder}
              foldersCount={foldersCount?.[folder.id]}
              folders={folders}
              setFocusId={setFocusId}
              folderRefId={folderRefId}
              isFavorited={isFavorited}
            />
          ))}
        </BlockWrapper>
      )}
    </WhileLoading>
  );
};
