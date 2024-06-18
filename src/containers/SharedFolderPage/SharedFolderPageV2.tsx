/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { t } from "i18next";
import keyBy from "lodash/keyBy";
import { useContext, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { breakpoints, colors, misc, mq, spacing } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { Copy } from "@ndla/icons/action";
import { HumanMaleBoard } from "@ndla/icons/common";
import { Text } from "@ndla/typography";
import { BlockResource, Folder, ListResource, OneColumn } from "@ndla/ui";
import { SaveLink } from "./components/SaveLink";
import { AuthContext } from "../../components/AuthenticationContext";
import CopyFolderModal from "../../components/MyNdla/CopyFolderModal";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { GQLFolder, GQLFolderResource, GQLFolderResourceMeta } from "../../graphqlTypes";
import { routes } from "../../routeHelpers";
import { FolderTotalCount, getTotalCountForFolder } from "../../util/folderHelpers";
import ErrorPage from "../ErrorPage";
import { useFolderResourceMetaSearch, useGetSharedFolder } from "../MyNdla/folderMutations";
import { BlockWrapper, ViewType } from "../MyNdla/Folders/FoldersPage";
import FoldersPageTitle from "../MyNdla/Folders/FoldersPageTitle";
import ListViewOptions from "../MyNdla/Folders/ListViewOptions";
import NotFound from "../NotFoundPage/NotFoundPage";

const flattenResources = (folder?: GQLFolder): GQLFolderResource[] => {
  const subResources = folder?.subfolders.flatMap(flattenResources) ?? [];

  return (folder?.resources ?? []).concat(subResources);
};
const FoldersPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const OptionsWrapper = styled.div`
  display: none;
  flex: 1;

  ${mq.range({ from: breakpoints.tablet })} {
    display: flex;
  }
`;

const SharedFolderInformationWrapper = styled.div`
  max-width: 800px;
  display: flex;
  background-color: ${colors.brand.greyLightest};
  align-items: center;
  gap: ${spacing.nsmall};
  padding: ${spacing.normal};
  border: 2px solid ${colors.brand.neutral7};
  border-radius: ${misc.borderRadius};

  margin: ${spacing.small} 0;

  ${mq.range({ from: breakpoints.mobileWide })} {
    margin: ${spacing.large} 0;
  }
`;

const StyledRow = styled.div`
  margin: ${spacing.small} 0;
  gap: ${spacing.nsmall};
  display: flex;
  justify-content: space-between;
`;

const StyledInformationIcon = styled(HumanMaleBoard)`
  height: ${spacing.mediumlarge};
  width: ${spacing.mediumlarge};
`;

const FolderDescription = styled(Text)`
  font-style: italic;
`;

const ListItem = styled.li`
  padding: 0;
  list-style: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: ${spacing.normal} 0;
  margin-bottom: ${spacing.normal};
  gap: ${spacing.small};
`;

const containsFolder = (folder: GQLFolder): boolean => {
  return !!folder.subfolders.find((subfolder) => containsFolder(subfolder) || folder.resources.length > 0);
};

const SharedFolderPageV2 = () => {
  const [viewType, setViewType] = useState<ViewType>("list");
  const { folderId = "" } = useParams();

  const { authenticated } = useContext(AuthContext);

  const { folder, loading, error } = useGetSharedFolder({
    id: folderId,
    includeResources: true,
    includeSubfolders: true,
  });

  const { data } = useFolderResourceMetaSearch(
    flattenResources(folder).map((res) => ({
      id: res.resourceId,
      path: res.path,
      resourceType: res.resourceType,
    })) ?? [],
    { skip: !folder || folder?.resources?.length === 0 },
  );

  const foldersCount = useMemo(
    () =>
      folder?.subfolders?.reduce<Record<string, FolderTotalCount>>((acc, curr) => {
        acc[curr.id] = getTotalCountForFolder(curr);
        return acc;
      }, {}),
    [folder?.subfolders],
  );

  const keyedData = keyBy(data ?? [], (resource) => `${resource.type}-${resource.id}`);
  const metaWithMetaImage = data?.find((d) => !!d.metaImage?.url);

  const Resource = viewType === "block" ? BlockResource : ListResource;

  const warningText = t(`myNdla.folder.sharing.warning.${authenticated ? "authenticated" : "unauthenticated"}`, {
    name: folder?.owner?.name ?? t("myNdla.folder.professional"),
  });

  const getResourceMetaTypes = (resource: GQLFolderResource, resourceMeta?: GQLFolderResourceMeta) =>
    resourceMeta
      ? resourceMeta?.resourceTypes.length < 1
        ? [{ id: resource.resourceType, name: t(`contentTypes.${resource.resourceType}`) }]
        : resourceMeta.resourceTypes
      : [];

  const getResourceMetaPath = (resource: GQLFolderResource, resourceMeta: any) =>
    resourceMeta &&
    resourceMeta?.resourceTypes.length < 1 &&
    (resource.resourceType === "article" || resource.resourceType === "learningpath")
      ? `/${resource.resourceType}${resource.resourceType === "learningpath" ? "s" : ""}/${resource.resourceId}`
      : resource.path;

  if (loading) {
    return <Spinner />;
  }
  if (error?.graphQLErrors[0]?.extensions?.status === 404) {
    return <NotFound />;
  }
  if (error || !folder) {
    return <ErrorPage />;
  }

  return (
    <main>
      <OneColumn>
        <FoldersPageContainer>
          <div>
            <Helmet title={folder.name} />
            <SocialMediaMetadata
              type="website"
              title={folder.name}
              imageUrl={metaWithMetaImage?.metaImage?.url}
              description={t("myNdla.sharedFolder.description.info")}
            >
              <meta name="robots" content="noindex, nofollow" />
            </SocialMediaMetadata>
            <div>
              <SharedFolderInformationWrapper>
                <StyledInformationIcon />
                <Text margin="none" textStyle="meta-text-medium">
                  {warningText}
                </Text>
              </SharedFolderInformationWrapper>
              <ButtonContainer>
                <CopyFolderModal folder={folder}>
                  <ButtonV2 variant="ghost">
                    <Copy />
                    {t("myNdla.folder.copy")}
                  </ButtonV2>
                </CopyFolderModal>
                <SaveLink folder={folder} hideTrigger={() => {}} />
              </ButtonContainer>
            </div>
            <FoldersPageTitle key={folder?.id} selectedFolder={folder} enableBreadcrumb={false} />
            <FolderDescription margin="none" textStyle="content-alt">
              {folder.description ?? t("myNdla.folder.defaultPageDescription")}
            </FolderDescription>
            <StyledRow>
              <OptionsWrapper>
                <ListViewOptions type={viewType} onTypeChange={setViewType} />
              </OptionsWrapper>
            </StyledRow>
            {folder.subfolders.length > 0 && (
              <BlockWrapper data-type={viewType} data-no-padding={true}>
                {folder.subfolders.map((subFolder) =>
                  containsFolder(subFolder) ? (
                    <ListItem key={`folder-${subFolder.id}`}>
                      <Folder
                        id={subFolder.id}
                        title={subFolder.name}
                        type={viewType}
                        link={routes.folder(subFolder.id)}
                        subFolders={foldersCount?.[subFolder.id]?.folders}
                        subResources={foldersCount?.[subFolder.id]?.resources}
                        isShared={false}
                      />
                    </ListItem>
                  ) : null,
                )}
              </BlockWrapper>
            )}
            <BlockWrapper data-type={viewType} data-no-padding={true}>
              {folder.resources.map((resource) => {
                const resourceMeta = keyedData[`${resource.resourceType}-${resource.resourceId}`];
                return resourceMeta ? (
                  <ListItem key={resource.id}>
                    <Resource
                      id={resource.id}
                      tagLinkPrefix={routes.myNdla.tags}
                      resourceImage={{
                        src: resourceMeta?.metaImage?.url ?? "",
                        alt: "",
                      }}
                      link={getResourceMetaPath(resource, resourceMeta)}
                      tags={resource.tags}
                      resourceTypes={getResourceMetaTypes(resource, resourceMeta)}
                      title={resourceMeta ? resourceMeta.title : t("myNdla.sharedFolder.resourceRemovedTitle")}
                      description={viewType !== "list" ? resourceMeta?.description ?? "" : undefined}
                    />
                  </ListItem>
                ) : null;
              })}
            </BlockWrapper>
          </div>
        </FoldersPageContainer>
      </OneColumn>
    </main>
  );
};

export default SharedFolderPageV2;
