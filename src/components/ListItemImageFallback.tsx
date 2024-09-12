/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { HeadphoneLine, VolumeUp } from "@ndla/icons/common";
import { LearningPath } from "@ndla/icons/contentType";
import { H5P, ImageLine, PlayBoxOutline } from "@ndla/icons/editor";
import { styled } from "@ndla/styled-system/jsx";

interface Props {
  contentType?: string;
  iconSize?: "small" | "medium" | "large" | "xlarge";
}

const getIcon = (contentType: string) => {
  switch (contentType) {
    case "learning-path":
      return <LearningPath />;
    case "image":
      return <ImageLine />;
    case "video":
      return <PlayBoxOutline />;
    case "h5p":
      return <H5P />;
    case "podcast":
      return <HeadphoneLine />;
    case "audio":
      return <VolumeUp />;
    default:
      return <ImageLine />;
  }
};

const IconWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  defaultVariants: {
    sizes: "small",
  },
  variants: {
    sizes: {
      small: {
        minWidth: "56px",
        maxWidth: "56px",
      },
      medium: {
        tabletWide: {
          minWidth: "102px",
          maxWidth: "102px",
          minHeight: "77px",
          maxHeight: "77px",
        },
      },
      large: {
        height: "surface.3xsmall",
      },
      xlarge: {
        maxWidth: "surface.4xsmall",
        minWidth: "surface.4xsmall",
        maxHeight: "surface.4xsmall",
        minHeight: "surface.4xsmall",
        tabletDown: {
          maxWidth: "3xlarge",
          minWidth: "3xlarge",
          maxHeight: "3xlarge",
          minHeight: "3xlarge",
        },
      },
    },
  },
});

const ListItemImageFallback = ({ contentType = "image", iconSize = "small" }: Props) => {
  const icon = useMemo(() => {
    return getIcon(contentType);
  }, [contentType]);

  return <IconWrapper sizes={iconSize}>{icon}</IconWrapper>;
};

export default ListItemImageFallback;
