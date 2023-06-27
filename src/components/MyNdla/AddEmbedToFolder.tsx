/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FavoriteButton } from '@ndla/button';
import { EmbedMetaData } from '@ndla/types-embed';
import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NoSSR } from '@ndla/util';
import { ResourceAttributes } from './AddResourceToFolder';
import AddResourceToFolderModal from './AddResourceToFolderModal';
import { useFolders } from '../../containers/MyNdla/folderMutations';
import { getAllResources } from '../../util/folderHelpers';

interface Props {
  embed: Extract<EmbedMetaData, { status: 'success' }>;
}

const embedToResource = (
  embed: Extract<EmbedMetaData, { status: 'success' }>,
): ResourceAttributes | undefined => {
  switch (embed.resource) {
    case 'audio':
      return {
        id: embed.data.id.toString(),
        resourceType: 'audio',
        path: `/audio/${embed.data.id}`,
      };
    case 'brightcove':
      return {
        id: embed.data.id.toString(),
        resourceType: 'video',
        path: `/video/${embed.data.id}`,
      };
    case 'image':
      return {
        id: embed.data.id.toString(),
        resourceType: 'image',
        path: `/image/${embed.data.id}`,
      };
    case 'concept':
      return {
        id: embed.data.concept.id.toString(),
        resourceType: 'concept',
        path: `/concept/${embed.data.concept.id}`,
      };
    default:
      return undefined;
  }
};

const ClientAddEmbedToFolder = ({ embed }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const resource = useMemo(() => embedToResource(embed), [embed]);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const { pathname } = useLocation();
  const { folders } = useFolders();

  const exists = useMemo(() => {
    const resources = getAllResources(folders);
    return resources.some((r) => r.path === pathname);
  }, [folders, pathname]);

  if (!resource) {
    return null;
  }

  return (
    <>
      <FavoriteButton onClick={onOpen} isFavorite={exists} />
      {isOpen && (
        <AddResourceToFolderModal
          isOpen={isOpen}
          onClose={onClose}
          resource={resource}
        />
      )}
    </>
  );
};

const AddEmbedToFolder = ({ embed }: Props) => {
  return (
    <NoSSR fallback={<FavoriteButton />}>
      <ClientAddEmbedToFolder embed={embed} />
    </NoSSR>
  );
};

export default AddEmbedToFolder;
