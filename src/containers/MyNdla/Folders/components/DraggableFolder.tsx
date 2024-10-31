/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { styled } from "@ndla/styled-system/jsx";
import { useFolderActions } from "./FolderActionHooks";
import { Folder } from "../../../../components/MyNdla/Folder";
import { GQLFolder } from "../../../../graphqlTypes";
import { FolderTotalCount } from "../../../../util/folderHelpers";
import DragHandle from "../../components/DragHandle";
import SettingsMenu from "../../components/SettingsMenu";

interface Props {
  folder: GQLFolder;
  index: number;
  foldersCount?: FolderTotalCount;
  folders: GQLFolder[];
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  folderRefId?: string;
  isFavorited?: boolean;
}

export const DraggableListItem = styled("li", {
  base: {
    display: "flex",
    position: "relative",
    listStyle: "none",
    alignItems: "center",
    gap: "xxsmall",
  },
  variants: {
    isDragging: {
      true: {
        zIndex: "docked",
      },
    },
  },
});

export const DragWrapper = styled("div", {
  base: {
    maxWidth: "100%",
    height: "100%",
    background: "surface.default",
    flexGrow: "1",
  },
});

const DraggableFolder = ({ index, folder, foldersCount, folders, setFocusId, folderRefId, isFavorited }: Props) => {
  const { t } = useTranslation();
  const { attributes, setNodeRef, transform, transition, items, isDragging } = useSortable({
    id: folder.id,
    data: {
      name: folder.name,
      index: index + 1,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const folderMenuActions = useFolderActions(folder, setFocusId, folders, false, folderRefId, isFavorited);

  const menu = useMemo(
    () => <SettingsMenu menuItems={folderMenuActions} modalHeader={t("myNdla.tools")} />,
    [folderMenuActions, t],
  );

  return (
    <DraggableListItem id={`folder-${folder.id}`} ref={setNodeRef} style={style} isDragging={isDragging}>
      <DragHandle sortableId={folder.id} disabled={items.length < 2} name={folder.name} type="folder" {...attributes} />
      <DragWrapper>
        <Folder folder={folder} foldersCount={foldersCount} menu={menu} isFavorited={isFavorited} variant="subtle" />
      </DragWrapper>
    </DraggableListItem>
  );
};

export default memo(DraggableFolder);
