/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Announcements } from "@dnd-kit/core";
import { TFunction } from "i18next";

interface DraggableData {
  name: string;
  index: number;
}

export const makeDndTranslations = (type: "learningpathstep", t: TFunction, length: number): Announcements => {
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
