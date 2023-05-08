/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { FavoriteButton } from '@ndla/button';
import { EmbedMetaData } from '@ndla/types-embed';
import { useCallback, useMemo, useState } from 'react';
import config from '../../config';
import { ResourceAttributes } from './AddResourceToFolder';
import AddResourceToFolderModal from './AddResourceToFolderModal';

interface Props {
  embed: Extract<EmbedMetaData, { status: 'success' }>;
}

const ButtonWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const embedToResource = (
  embed: Extract<EmbedMetaData, { status: 'success' }>,
): ResourceAttributes | undefined => {
  switch (embed.resource) {
    case 'audio':
      return {
        id: embed.data.id.toString(),
        resourceType: 'audio',
        path: `${config.ndlaFrontendDomain}/audio/${embed.data.id}`,
      };
    case 'brightcove':
      return {
        id: embed.data.id.toString(),
        resourceType: 'video',
        path: `${config.ndlaFrontendDomain}/video/${embed.data.id}`,
      };
    case 'image':
      return {
        id: embed.data.id.toString(),
        resourceType: 'image',
        path: `${config.ndlaFrontendDomain}/image/${embed.data.id}`,
      };
    case 'concept':
      return {
        id: embed.data.concept.id.toString(),
        resourceType: 'concept',
        path: `${config.ndlaFrontendDomain}/concept/${embed.data.concept.id}`,
      };
    default:
      return undefined;
  }
};

const AddEmbedToFolder = ({ embed }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const resource = useMemo(() => embedToResource(embed), [embed]);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpen = useCallback(() => setIsOpen(true), []);

  if (!resource) {
    return null;
  }
  return (
    <ButtonWrapper>
      <FavoriteButton onClick={onOpen} />
      {isOpen && (
        <AddResourceToFolderModal
          isOpen={isOpen}
          onClose={onClose}
          resource={resource}
        />
      )}
    </ButtonWrapper>
  );
};

export default AddEmbedToFolder;
