/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GQLFolder } from "../../graphqlTypes";
import { TreeStructure } from "./TreeStructure";

const ComboboxContainer = styled("div", {
  base: {
    display: "flex",
  },
});

interface Props {
  folders: GQLFolder[];
  loading: boolean;
  selectedFolderId: string | undefined;
  setSelectedFolderId: (v: string | undefined) => void;
  defaultOpenFolder?: GQLFolder;
  placements?: Set<string>;
}

export const ROOT_FOLDER_ID = "favorites";

const DEFAULT_OPEN = [ROOT_FOLDER_ID];

export const FolderSelect = ({
  folders,
  loading,
  selectedFolderId,
  setSelectedFolderId,
  defaultOpenFolder,
  placements,
}: Props) => {
  const { t } = useTranslation();

  const structureFolders: GQLFolder[] = useMemo(
    () => [
      {
        id: ROOT_FOLDER_ID,
        name: t("myNdla.myFavorites"),
        status: "private",
        subfolders: folders,
        breadcrumbs: [],
        resources: [],
        created: "",
        updated: "",
      },
    ],
    [folders, t],
  );

  const defaultOpenFolders = useMemo(() => {
    return defaultOpenFolder ? DEFAULT_OPEN.concat(defaultOpenFolder.breadcrumbs.map((c) => c.id)) : DEFAULT_OPEN;
  }, [defaultOpenFolder]);

  useEffect(() => {
    const last = defaultOpenFolders[defaultOpenFolders.length - 1];
    if (last !== ROOT_FOLDER_ID && !selectedFolderId) {
      setSelectedFolderId(last);
    }
  }, [defaultOpenFolders, selectedFolderId, setSelectedFolderId]);

  return (
    <ComboboxContainer>
      <TreeStructure
        loading={loading}
        folders={structureFolders}
        label={t("myNdla.myFolders")}
        onSelectFolder={setSelectedFolderId}
        defaultOpenFolders={defaultOpenFolders}
        placements={placements}
        ariaDescribedby="treestructure-error-label"
      />
    </ComboboxContainer>
  );
};
