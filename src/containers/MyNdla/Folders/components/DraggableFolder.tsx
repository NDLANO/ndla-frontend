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
import { colors, spacing, stackOrder } from "@ndla/core";
import FolderActions from "./FolderActions";
import { Folder } from "../../../../components/MyNdla/Folder";
import { GQLFolder } from "../../../../graphqlTypes";
import { FolderTotalCount } from "../../../../util/folderHelpers";
import DragHandle from "../../components/DragHandle";
import { ViewType } from "../FoldersPage";

interface Props {
  folder: GQLFolder;
  index: number;
  type: ViewType;
  foldersCount?: FolderTotalCount;
  folders: GQLFolder[];
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  folderRefId?: string;
  isFavorited?: boolean;
}

export const DraggableListItem = styled.li`
  display: flex;
  position: relative;
  list-style: none;
  padding: 0;
  align-items: center;
  gap: ${spacing.xsmall};
  z-index: ${stackOrder.base};

  &[data-is-dragging="true"] {
    z-index: ${stackOrder.offsetSingle};
  }
`;

export const DragWrapper = styled.div`
  max-width: 100%;
  background-color: ${colors.white};
  flex-grow: 1;
`;

const DraggableFolder = ({
  index,
  folder,
  type,
  foldersCount,
  folders,
  setFocusId,
  folderRefId,
  isFavorited,
}: Props) => {
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
        isFavorited={isFavorited}
      />
    ),
    [folder, folders, setFocusId, folderRefId, isFavorited],
  );

  return (
    <DraggableListItem id={`folder-${folder.id}`} ref={setNodeRef} style={style} data-is-dragging={isDragging}>
      {!isFavorited && (
        <DragHandle
          sortableId={folder.id}
          disabled={type === "block" || items.length < 2}
          name={folder.name}
          type="folder"
          {...attributes}
        />
      )}
      <DragWrapper>
        <Folder folder={folder} foldersCount={foldersCount} type={type} menu={menu} isFavorited={isFavorited} />
      </DragWrapper>
    </DraggableListItem>
  );
};

export default memo(DraggableFolder);
