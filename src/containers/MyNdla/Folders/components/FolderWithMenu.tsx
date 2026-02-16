/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Folder } from "../../../../components/MyNdla/Folder";
import { GQLFolder } from "../../../../graphqlTypes";
import { SettingsMenu } from "../../components/SettingsMenu";
import { folderId, FOLDERS_HEADING_ID, SHARED_FOLDERS_HEADING_ID, sharedFolderId } from "../util";
import { useFolderActions } from "./FolderActionHooks";

interface Props {
  folder: GQLFolder;
  isFavorited?: boolean;
}

export const FolderWithMenu = ({ folder, isFavorited }: Props) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLLIElement>(null);

  const folderMenuActions = useFolderActions(
    folder,
    ref,
    false,
    isFavorited ? SHARED_FOLDERS_HEADING_ID : FOLDERS_HEADING_ID,
    isFavorited,
  );

  const menu = useMemo(
    () => <SettingsMenu menuItems={folderMenuActions} modalHeader={t("myNdla.tools")} />,
    [folderMenuActions, t],
  );

  return (
    <li id={isFavorited ? sharedFolderId(folder.id) : folderId(folder.id)} ref={ref}>
      <Folder folder={folder} menu={menu} isFavorited={isFavorited} />
    </li>
  );
};
