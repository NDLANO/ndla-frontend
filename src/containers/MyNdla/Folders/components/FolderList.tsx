/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState, useEffect, SetStateAction, Dispatch } from "react";
import { useTranslation } from "react-i18next";
import { Reference } from "@apollo/client";
import { useApolloClient } from "@apollo/client/react";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableFolder from "./DraggableFolder";
import { BlockWrapper } from "../../../../components/MyNdla/BlockWrapper";
import { PageSpinner } from "../../../../components/PageSpinner";
import WhileLoading from "../../../../components/WhileLoading";
import { GQLFolder, GQLSharedFolder } from "../../../../graphqlTypes";
import { useSortFoldersMutation } from "../../../../mutations/folderMutations";
import { FolderTotalCount, getTotalCountForFolder } from "../../../../util/folderHelpers";
import { makeDndTranslations } from "../../dndUtil";
import { makeDndSortFunction } from "../util";

interface Props {
  loading: boolean;
  folders: GQLFolder[];
  folderId: string | undefined;
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  folderRefId?: string;
  isFavorited?: boolean;
}

export const getFolderCount = (folders: GQLFolder[] | GQLSharedFolder[]) =>
  folders.reduce<Record<string, FolderTotalCount>>((acc, curr) => {
    acc[curr.id] = getTotalCountForFolder(curr);
    return acc;
  }, {});

const FolderList = ({ loading, folders, folderId, setFocusId, folderRefId, isFavorited }: Props) => {
  const { t } = useTranslation();
  const [sortFolders] = useSortFoldersMutation({ type: isFavorited ? "sharedFolder" : "folder" });
  const client = useApolloClient();
  const [sortedFolders, setSortedFolders] = useState(folders);

  useEffect(() => {
    setSortedFolders(folders);
  }, [folders]);

  const foldersCount = useMemo(() => getFolderCount(folders), [folders]);

  const updateCache = (newOrder: string[]) => {
    const typeName = isFavorited ? "SharedFolder" : "Folder";
    const sortCacheModifierFunction = <T extends Reference>(existing: readonly T[]): T[] => {
      return newOrder.map((id) => existing.find((ef) => ef.__ref === `${typeName}:${id}`)!);
    };

    if (folderId) {
      client.cache.modify({
        id: client.cache.identify({
          __ref: `Folder:${folderId}`,
        }),
        fields: { subfolders: sortCacheModifierFunction },
      });
    } else {
      const field = isFavorited ? "sharedFolders" : "folders";
      client.cache.modify({
        fields: {
          folders: (input) => {
            return {
              ...input,
              [field]: sortCacheModifierFunction(input[field]),
            };
          },
        },
      });
    }
  };

  const announcements = useMemo(() => makeDndTranslations("folder", t, folders.length), [folders, t]);

  const sortFolderIds = makeDndSortFunction(folderId, folders, sortFolders, updateCache, setSortedFolders);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <WhileLoading isLoading={loading} fallback={<PageSpinner />}>
      {folders.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={sortFolderIds}
          accessibility={{ announcements }}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext items={sortedFolders} disabled={folders.length < 2} strategy={verticalListSortingStrategy}>
            <BlockWrapper>
              {folders.map((folder, index) => (
                <DraggableFolder
                  key={`folder-${folder.id}`}
                  folder={folder}
                  index={index}
                  foldersCount={foldersCount?.[folder.id]}
                  folders={folders}
                  setFocusId={setFocusId}
                  folderRefId={folderRefId}
                  isFavorited={isFavorited}
                />
              ))}
            </BlockWrapper>
          </SortableContext>
        </DndContext>
      )}
    </WhileLoading>
  );
};
export default FolderList;
