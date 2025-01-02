/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentType, forwardRef } from "react";
import { HeadphoneLine, VolumeUpLine, H5P, ImageLine, MovieLine, TextWrap, IconProps } from "@ndla/icons";
import { ContentType } from "@ndla/ui";

interface Props extends IconProps {
  contentType?: ContentType;
}

const getIcon = (contentType: string | undefined) => {
  switch (contentType) {
    case "learning-path":
      return TextWrap;
    case "image":
      return ImageLine;
    case "video":
      return MovieLine;
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

export const ContentTypeFallbackIcon = forwardRef<SVGSVGElement, Props>(({ contentType, ...props }, ref) => {
  const Element: ComponentType<IconProps> = getIcon(contentType);
  return <Element ref={ref} {...props} />;
});
