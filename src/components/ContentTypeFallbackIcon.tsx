/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithRef, ComponentType, forwardRef } from "react";
import { HeadphoneLine, VolumeUpLine } from "@ndla/icons/common";
import { LearningPath } from "@ndla/icons/contentType";
import { H5P, ImageLine, PlayBoxOutline } from "@ndla/icons/editor";
import { ContentType } from "@ndla/ui";

interface Props extends ComponentPropsWithRef<"svg"> {
  contentType?: ContentType;
}

const getIcon = (contentType: string | undefined) => {
  switch (contentType) {
    case "learning-path":
      return LearningPath;
    case "image":
      return ImageLine;
    case "video":
      return PlayBoxOutline;
    case "h5p":
      return H5P;
    case "podcast":
      return HeadphoneLine;
    case "audio":
      return VolumeUpLine;
    default:
      return ImageLine;
  }
};

export const ContentTypeFallbackIcon = forwardRef<SVGElement, Props>(({ contentType, ...props }, ref) => {
  const Element: ComponentType = getIcon(contentType);
  return <Element ref={ref} {...props} />;
});
