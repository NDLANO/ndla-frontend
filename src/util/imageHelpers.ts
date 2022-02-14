/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLImageElement } from '../graphqlTypes';

export const getCrop = (visualElement: GQLImageElement) => {
  if (
    visualElement.lowerRightX &&
    visualElement.lowerRightY &&
    visualElement.upperLeftX &&
    visualElement.upperLeftY
  ) {
    return {
      startX: visualElement.lowerRightX,
      startY: visualElement.lowerRightY,
      endX: visualElement.upperLeftX,
      endY: visualElement.upperLeftY,
    };
  }
  return undefined;
};

export const getFocalPoint = (visualElement: GQLImageElement) => {
  if (visualElement.focalX && visualElement.focalY) {
    return { x: visualElement.focalX, y: visualElement.focalY };
  }
  return undefined;
};

export const getImageWithoutCrop = (
  image?: GQLImageElement,
): GQLImageElement | undefined => {
  return (
    image && {
      ...image,
      focalX: undefined,
      focalY: undefined,
      upperLeftX: undefined,
      upperLeftY: undefined,
      lowerRightX: undefined,
      lowerRightY: undefined,
    }
  );
};
