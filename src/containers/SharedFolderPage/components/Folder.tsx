/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { ArrowDropDown } from '@ndla/icons/common';
import { useMemo, useState } from 'react';
import {
  GQLFolder,
  GQLFolderResourceMetaSearchQuery,
} from '../../../graphqlTypes';
import FolderResource from './FolderResource';

export const StyledUl = styled.ul`
  margin-left: ${spacing.normal};
  list-style: none;
`;

const containsFolder = (folder: GQLFolder, targetId: string): boolean => {
  return (
    folder.id === targetId ||
    !!folder.subfolders.find(subfolder => containsFolder(subfolder, targetId))
  );
};

const containsResource = (folder: GQLFolder): boolean => {
  return (
    folder.resources.length > 0 ||
    !!folder.subfolders.find(subfolder => containsResource(subfolder))
  );
};

interface Props {
  folder: GQLFolder;
  defaultOpenFolder: string;
  meta: Record<
    string,
    GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0]
  >;
}

const Folder = ({ folder, meta, defaultOpenFolder }: Props) => {
  const { name, subfolders, resources } = folder;

  const [isOpen, setIsOpen] = useState(
    containsFolder(folder, defaultOpenFolder),
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isEmpty = useMemo(() => !containsResource(folder), []);

  if (isEmpty) {
    return null;
  }

  return (
    <li role="none" data-list-item>
      <ButtonV2
        id={`folder-${folder.id}`}
        variant="ghost"
        role="treeitem"
        onClick={() => setIsOpen(!isOpen)}>
        <ArrowDropDown /> {name}
      </ButtonV2>
      {isOpen && (
        <StyledUl role="group" data-list>
          {subfolders.map(subfolder => (
            <Folder
              defaultOpenFolder={defaultOpenFolder}
              key={subfolder.id}
              folder={subfolder}
              meta={meta}
            />
          ))}

          {resources.map(resource => (
            <FolderResource
              key={resource.id}
              parentId={folder.id}
              meta={meta[`${resource.resourceType}-${resource.resourceId}`]}
              resource={resource}
            />
          ))}
        </StyledUl>
      )}
    </li>
  );
};

export default Folder;
