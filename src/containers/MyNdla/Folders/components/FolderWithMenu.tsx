/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Folder } from "../../../../components/MyNdla/Folder";
import { GQLFolder } from "../../../../graphqlTypes";
import { FolderTotalCount } from "../../../../util/folderHelpers";
import { SettingsMenu } from "../../components/SettingsMenu";
import { useFolderActions } from "./FolderActionHooks";

interface Props {
  folder: GQLFolder;
  foldersCount?: FolderTotalCount;
  folders: GQLFolder[];
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  folderRefId?: string;
  isFavorited?: boolean;
}

export const FolderWithMenu = ({ folder, foldersCount, folders, setFocusId, folderRefId, isFavorited }: Props) => {
  const { t } = useTranslation();

  const folderMenuActions = useFolderActions(folder, setFocusId, folders, false, folderRefId, isFavorited);

  const menu = useMemo(
    () => <SettingsMenu menuItems={folderMenuActions} modalHeader={t("myNdla.tools")} />,
    [folderMenuActions, t],
  );

  return (
    <li id={`folder-${folder.id}`}>
      <Folder folder={folder} foldersCount={foldersCount} menu={menu} isFavorited={isFavorited} />
    </li>
  );
};
