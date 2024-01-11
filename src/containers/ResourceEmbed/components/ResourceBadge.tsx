/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType, HTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { colors, spacing, misc } from '@ndla/core';
import { Podcast, Audio } from '@ndla/icons/common';
import { Concept, H5P, Media, Video } from '@ndla/icons/editor';
import { EmbedType } from './ResourceEmbedWrapper';

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
  video: Video,
  audio: Audio,
  podcast: Podcast,
  h5p: H5P,
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
