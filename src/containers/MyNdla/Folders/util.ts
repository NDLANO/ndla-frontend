/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { DragEndEvent, Announcements } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import config from "../../../config";

export const makeDndSortFunction = <PID, RES, T extends { id: string }>(
  parentId: PID,
  sortables: T[],
  sortFunction: (options: { variables: { sortedIds: string[]; parentId: PID } }) => Promise<RES>,
  updateCache: (newOrder: string[]) => void,
  setSortedFoldersState: (setNew: T[]) => void,
) => {
  return async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over === null) return;

    const originalIds = sortables.map((f) => f.id);
    const oldIndex = originalIds.indexOf(active.id as string);
    const newIndex = originalIds.indexOf(over.id as string);

    if (newIndex === undefined || newIndex === oldIndex) return;

    const newSorted = arrayMove(sortables, oldIndex, newIndex);
    setSortedFoldersState(newSorted);

    const sortedIds = newSorted.map((f) => f.id);

    // Update cache before sorting happens to make GUI feel snappy
    updateCache(sortedIds);

    return sortFunction({
      variables: {
        sortedIds,
        parentId,
      },
    }).catch(() => updateCache(originalIds));
  };
};

interface DraggableData {
  name: string;
  index: number;
}

export const makeDndTranslations = (
  type: "folder" | "resource" | "category",
  t: TFunction,
  length: number,
): Announcements => {
  return {
    onDragStart: ({ active }) => {
      const { name, index } = active.data.current as DraggableData;
      return t(`myNdla.${type}.onDragStart`, {
        name,
        index,
        length,
      });
    },
    onDragOver: ({ active, over }) => {
      const { name } = active.data.current as DraggableData;
      const overData = over?.data.current as DraggableData;
      return overData
        ? t(`myNdla.${type}.onDragOver`, {
            name,
            index: overData.index,
            length,
          })
        : t(`myNdla.${type}.onDragMissingOver`, { name });
    },
    onDragEnd: ({ active, over }) => {
      const { name } = active.data.current as DraggableData;
      const overData = over?.data.current as DraggableData;
      return overData
        ? t(`myNdla.${type}.onDragEnd`, {
            name,
            index: overData.index,
            length,
          })
        : t(`myNdla.${type}.onDragEndMissingOver`, { name });
    },
    onDragCancel: ({ active }) => {
      const { name } = active.data.current as DraggableData;
      return t(`myNdla.${type}.onDragCancel`, { name });
    },
  };
};

export const sharedFolderLink = (id: string) => `${config.ndlaFrontendDomain}/folder/${id}`;

export const copyFolderSharingLink = (id: string) => window.navigator.clipboard.writeText(sharedFolderLink(id));

export interface withRole {
  role: string;
}

export const isStudent = (user: withRole | undefined) => user?.role === "student";
