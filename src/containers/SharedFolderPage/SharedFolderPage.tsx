/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import keyBy from 'lodash/keyBy';
import { useParams } from 'react-router-dom';
import { GQLFolder, GQLFolderResource } from '../../graphqlTypes';
import {
  useFolderResourceMetaSearch,
  useSharedFolder,
} from '../MyNdla/folderMutations';
import FolderNavigation from './components/FolderNavigation';
import Resource from './components/Resource';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
`;

// Util
const flattenResources = (folder?: GQLFolder): GQLFolderResource[] => {
  if (!folder) {
    return [];
  }
  const subResources = folder.subfolders.flatMap(flattenResources);

  return folder.resources.concat(subResources);
};

const SharedFolderPage = () => {
  const { folderId = '', subfolderId, resourceId } = useParams();

  const { folder, loading } = useSharedFolder({
    id: folderId,
    includeResources: true,
    includeSubfolders: true,
  });

  const resources = flattenResources(folder);

  const { data, loading: metaLoading } = useFolderResourceMetaSearch(
    resources.map(res => ({
      id: res.resourceId,
      path: res.path,
      resourceType: res.resourceType,
    })),
    { skip: resources.length === 0 },
  );

  const keyedData = keyBy(
    data ?? [],
    resource => `${resource.type}-${resource.id}`,
  );

  const selectedResource = resources.find(res => res.id === resourceId);

  return (
    <Layout>
      <div>
        INFO
        <FolderNavigation folder={folder} meta={keyedData} loading={loading} />
      </div>
      <div>
        {selectedResource ? (
          <Resource
            resource={selectedResource}
            meta={
              keyedData[
                `${selectedResource?.resourceType}-${selectedResource?.resourceId}`
              ]
            }
          />
        ) : (
          <div>qwe</div>
        )}
      </div>
    </Layout>
  );
};

export default SharedFolderPage;
