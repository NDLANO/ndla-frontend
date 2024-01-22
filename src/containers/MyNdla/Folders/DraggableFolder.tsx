/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, memo, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Folder } from "@ndla/ui";
import DragHandle from "./DragHandle";
import FolderActions from "./FolderActions";
import { ViewType } from "./FoldersPage";
import { GQLFolder } from "../../../graphqlTypes";
import { FolderTotalCount } from "../../../util/folderHelpers";

interface Props {
  folder: GQLFolder;
  index: number;
  type: ViewType;
  foldersCount: Record<string, FolderTotalCount>;
  folders: GQLFolder[];
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  folderRefId?: string;
}

export const DraggableListItem = styled.li`
  display: flex;
  position: relative;
  list-style: none;
  padding: 0;
  align-items: center;
  gap: ${spacing.xsmall};
  z-index: 0;

  &[data-is-dragging="true"] {
    z-index: "10";
  }
`;

export const DragWrapper = styled.div`
  max-width: 100%;
  background-color: ${colors.white};
  flex-grow: 1;
`;

const DraggableFolder = ({ index, folder, type, foldersCount, folders, setFocusId, folderRefId }: Props) => {
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

  const menu = useMemo(
    () => (
      <FolderActions
        folders={folders}
        key={folder.id}
        selectedFolder={folder}
        setFocusId={setFocusId}
        folderRefId={folderRefId}
      />
    ),
    [folder, folders, setFocusId, folderRefId],
  );

  return (
    <DraggableListItem id={`folder-${folder.id}`} ref={setNodeRef} style={style} data-is-dragging={isDragging}>
      <DragHandle
        sortableId={folder.id}
        disabled={type === "block" || items.length < 2}
        name={folder.name}
        type="folder"
        {...attributes}
      />
      <DragWrapper>
        <Folder
          id={folder.id}
          isShared={folder.status === "shared"}
          link={`/minndla/folders/${folder.id}`}
          title={folder.name}
          type={type}
          menu={menu}
          subFolders={foldersCount[folder.id]?.folders}
          subResources={foldersCount[folder.id]?.resources}
        />
      </DragWrapper>
    </DraggableListItem>
  );
};

export default memo(DraggableFolder);
