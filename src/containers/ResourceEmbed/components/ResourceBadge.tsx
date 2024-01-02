/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType, HTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { Podcast } from '@ndla/icons/common';
import { Concept, H5PBold, Media, SquareAudio, SquareVideo } from '@ndla/icons/editor';
import { EmbedType } from './ResourceEmbedWrapper';

interface Props extends HTMLAttributes<HTMLDivElement> {
  type: EmbedType;
}

const BadgeWrapper = styled.div`
  background-color: ${colors.brand.greyLight};
  padding: ${spacing.small};
  border: 2px solid ${colors.brand.grey};
  border-radius: 50%;
  stroke-width: 20px;
  line-height: 24px;
  svg {
    width: 24px;
    height: 24px;
  }
  ${mq.range({ from: breakpoints.tablet })} {
    margin-top: ${spacing.small};
  }
`;

const typeIconMapping: Record<EmbedType, ElementType> = {
  video: SquareVideo,
  audio: SquareAudio,
  podcast: Podcast,
  h5p: H5PBold,
  image: Media,
  concept: Concept,
};

const ResourceBadge = ({ type }: Props) => {
  const Icon = typeIconMapping[type] ?? typeIconMapping['image'];
  return (
    <BadgeWrapper>
      <Icon />
    </BadgeWrapper>
  );
};

export default ResourceBadge;
