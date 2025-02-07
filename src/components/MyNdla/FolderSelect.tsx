/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@ndla/styled-system/jsx";
import { IFolderDataDTO, IResourceDTO } from "@ndla/types-backend/myndla-api";
import NewFolder from "./NewFolder";
import { TreeStructure } from "./TreeStructure";
import { GQLFolder, GQLFolderResource } from "../../graphqlTypes";

const ComboboxContainer = styled("div", {
  base: {
    display: "flex",
    maxHeight: "surface.xsmall",
  },
});

interface Props {
  folders: GQLFolder[];
  loading: boolean;
  selectedFolderId: string | undefined;
  setSelectedFolderId: (v: string | undefined) => void;
  defaultOpenFolder?: GQLFolder;
  storedResource?: GQLFolderResource;
}

const FolderSelect = ({
  folders,
  loading,
  selectedFolderId,
  setSelectedFolderId,
  defaultOpenFolder,
  storedResource,
}: Props) => {
  const { t } = useTranslation();

  const structureFolders: GQLFolder[] = useMemo(
    () => [
      {
        id: "folders",
        name: t("myNdla.myFolders"),
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
    const firstFolderId = structureFolders?.[0]?.subfolders[0]?.id;
    const defaultOpenFolderIds = defaultOpenFolder?.breadcrumbs.map((bc) => bc.id);
    const defaultOpen = defaultOpenFolderIds
      ? ["folders"].concat(defaultOpenFolderIds)
      : firstFolderId
        ? ["folders", firstFolderId]
        : ["folders"];

    return defaultOpen;
  }, [structureFolders, defaultOpenFolder?.breadcrumbs]);

  useEffect(() => {
    const last = defaultOpenFolders[defaultOpenFolders.length - 1];
    if (last !== "folders" && !selectedFolderId) {
      setSelectedFolderId(last);
    }
  }, [defaultOpenFolders, selectedFolderId, setSelectedFolderId]);

  return (
    <ComboboxContainer>
      <TreeStructure
        loading={loading}
        folders={structureFolders as IFolderDataDTO[]}
        label={t("myNdla.myFolders")}
        onSelectFolder={setSelectedFolderId}
        defaultOpenFolders={defaultOpenFolders}
        targetResource={storedResource as IResourceDTO | undefined}
        newFolderInput={({ parentId, onCancel, onCreate }) => (
          <NewFolder parentId={parentId} onClose={onCancel} onCreate={onCreate} />
        )}
        ariaDescribedby="treestructure-error-label"
      />
    </ComboboxContainer>
  );
};
export default FolderSelect;
