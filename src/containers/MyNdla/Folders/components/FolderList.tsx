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
import { Spinner } from "@ndla/icons";
import DraggableFolder from "./DraggableFolder";
import WhileLoading from "../../../../components/WhileLoading";
import { GQLFolder } from "../../../../graphqlTypes";
import { getTotalCountForFolder } from "../../../../util/folderHelpers";
import { useSortFoldersMutation } from "../../folderMutations";
import { BlockWrapper, ViewType } from "../FoldersPage";
import { makeDndSortFunction, makeDndTranslations } from "../util";

interface Props {
  loading: boolean;
  type: ViewType;
  folders: GQLFolder[];
  folderId: string | undefined;
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  folderRefId?: string;
  isFavorited?: boolean;
}

const FolderList = ({ loading, type, folders, folderId, setFocusId, folderRefId, isFavorited }: Props) => {
  const { t } = useTranslation();
  const { sortFolders } = useSortFoldersMutation();
  const client = useApolloClient();
  const [sortedFolders, setSortedFolders] = useState(folders);

  useEffect(() => {
    setSortedFolders(folders);
  }, [folders]);

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
    <WhileLoading isLoading={loading} fallback={<Spinner />}>
      {folders.length > 0 && (
        <BlockWrapper data-type={type} data-no-padding={folders.length === 1}>
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
                  foldersCount={getTotalCountForFolder(folder)}
                  type={type}
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
