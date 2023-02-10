/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import {
  GQLFolder,
  GQLFolderResourceMetaSearchQuery,
} from '../../../graphqlTypes';
import FolderResource from './FolderResource';

export const StyledUl = styled.ul`
  margin-left: ${spacing.normal};
  list-style: none;
`;

interface Props {
  folder: GQLFolder;
  meta: Record<
    string,
    GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0]
  >;
}
const Folder = ({ folder, meta }: Props) => {
  const { name, subfolders, resources } = folder;
  return (
    <>
      <li>{name}</li>
      <StyledUl>
        {subfolders.map(subfolder => (
          <Folder key={subfolder.id} folder={subfolder} meta={meta} />
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
    </>
  );
};

export default Folder;
