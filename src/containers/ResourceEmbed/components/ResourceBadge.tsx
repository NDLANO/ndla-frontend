/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType, HTMLAttributes } from "react";
import styled from "@emotion/styled";
import { colors, spacing, misc } from "@ndla/core";
import { BroadcastLine, VoicePrintLine } from "@ndla/icons/common";
import { ChatLine, H5P, ImageLine, MovieLine, GlobalLine } from "@ndla/icons/editor";

type EmbedType = "video" | "audio" | "podcast" | "image" | "h5p" | "concept" | "gloss";

interface Props extends HTMLAttributes<HTMLDivElement> {
  type: EmbedType;
}

const BadgeWrapper = styled.div`
  min-width: ${spacing.large};
  min-height: ${spacing.large};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.brand.greyLight};
  border: 2px solid ${colors.brand.grey};
  border-radius: ${misc.borderRadiusLarge};

  svg {
    width: 24px;
    height: 24px;
    color: ${colors.brand.grey};
  }
`;

const typeIconMapping: Record<EmbedType, ElementType> = {
  video: MovieLine,
  audio: VoicePrintLine,
  podcast: BroadcastLine,
  h5p: H5P,
  image: ImageLine,
  concept: ChatLine,
  gloss: GlobalLine,
};

const ResourceBadge = ({ type }: Props) => {
  const Icon = typeIconMapping[type] ?? typeIconMapping["image"];
  return (
    <BadgeWrapper>
      <Icon />
    </BadgeWrapper>
  );
};

export default ResourceBadge;
