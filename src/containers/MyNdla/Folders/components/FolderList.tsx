/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState, useEffect, SetStateAction, Dispatch } from "react";
import { useTranslation } from "react-i18next";
import { Reference, useApolloClient } from "@apollo/client";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableFolder from "./DraggableFolder";
import { PageSpinner } from "../../../../components/PageSpinner";
import WhileLoading from "../../../../components/WhileLoading";
import { GQLFolder } from "../../../../graphqlTypes";
import { FolderTotalCount, getTotalCountForFolder } from "../../../../util/folderHelpers";
import { useSortFoldersMutation } from "../../folderMutations";
import { BlockWrapper } from "../FoldersPage";
import { makeDndSortFunction, makeDndTranslations } from "../util";

interface Props {
  loading: boolean;
  folders: GQLFolder[];
  folderId: string | undefined;
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  folderRefId?: string;
  isFavorited?: boolean;
}

const FolderList = ({ loading, folders, folderId, setFocusId, folderRefId, isFavorited }: Props) => {
  const { t } = useTranslation();
  const { sortFolders } = useSortFoldersMutation();
  const client = useApolloClient();
  const [sortedFolders, setSortedFolders] = useState(folders);

  useEffect(() => {
    setSortedFolders(folders);
  }, [folders]);

  const foldersCount = useMemo(
    () =>
      folders?.reduce<Record<string, FolderTotalCount>>((acc, curr) => {
        acc[curr.id] = getTotalCountForFolder(curr);
        return acc;
      }, {}),
    [folders],
  );

  const updateCache = (newOrder: string[]) => {
    const sortCacheModifierFunction = <T extends Reference>(existing: readonly T[]): T[] => {
      return newOrder.map((id) => existing.find((ef) => ef.__ref === `Folder:${id}`)!);
    };

    if (folderId) {
      client.cache.modify({
        id: client.cache.identify({
          __ref: `Folder:${folderId}`,
        }),
        fields: { subfolders: sortCacheModifierFunction },
      });
    } else {
      client.cache.modify({
        fields: {
          folders: ({ folders, ...rest }) => {
            return {
              folders: sortCacheModifierFunction(folders),
              ...rest,
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
        <BlockWrapper data-no-padding={folders.length === 1}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={sortFolderIds}
            accessibility={{ announcements }}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext items={sortedFolders} disabled={folders.length < 2} strategy={verticalListSortingStrategy}>
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
            </SortableContext>
          </DndContext>
        </BlockWrapper>
      )}
    </WhileLoading>
  );
};
export default FolderList;
