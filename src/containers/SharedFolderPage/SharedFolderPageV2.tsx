/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { OneColumn } from "@ndla/ui";
import SharedFolder from "./SharedFolder";
import { AuthContext } from "../../components/AuthenticationContext";
import { GQLFolder, GQLFolderResource } from "../../graphqlTypes";
import { routes } from "../../routeHelpers";
import ErrorPage from "../ErrorPage";
import { useGetSharedFolder, useSharedFolder } from "../MyNdla/folderMutations";
import { ViewType } from "../MyNdla/Folders/FoldersPage";
import NotFound from "../NotFoundPage/NotFoundPage";

const flattenResources = (folder?: GQLFolder): GQLFolderResource[] => {
  if (!folder) {
    return [];
  }
  const subResources = folder.subfolders.flatMap(flattenResources);

  return folder.resources.concat(subResources);
};
const FoldersPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const SharedFolderPageV2 = () => {
  const [viewType, setViewType] = useState<ViewType>("list");
  const { folderId = "", subfolderId } = useParams();
  const { authenticated } = useContext(AuthContext);

  const { folder, loading, error } = useGetSharedFolder({
    id: folderId,
    includeResources: true,
    includeSubfolders: true,
  });

  const subFolder = useSharedFolder(subfolderId);
  const selectedFolder = !subfolderId ? folder : subFolder;
  const resources = flattenResources(folder);

  if (authenticated) {
    return <Navigate to={routes.myNdla.folderShared(folderId)} />;
  }

  if (loading) {
    return <Spinner />;
  } else if (error?.graphQLErrors[0]?.extensions?.status === 404) {
    return <NotFound />;
  } else if (error || !selectedFolder) {
    return <ErrorPage />;
  }

  return (
    <main>
      <OneColumn>
        <FoldersPageContainer>
          <SharedFolder
            selectedFolder={selectedFolder}
            resources={resources}
            viewType={viewType}
            setViewType={setViewType}
          />
        </FoldersPageContainer>
      </OneColumn>
    </main>
  );
};

export default SharedFolderPageV2;
