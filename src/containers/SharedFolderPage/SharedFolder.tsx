/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import keyBy from "lodash/keyBy";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { breakpoints, colors, mq, spacing } from "@ndla/core";
import { HumanMaleBoard } from "@ndla/icons/common";
import { Text } from "@ndla/typography";
import { BlockResource, Folder, ListResource } from "@ndla/ui";
import { AuthContext } from "../../components/AuthenticationContext";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { GQLFolder, GQLFolderResource } from "../../graphqlTypes";
import { routes } from "../../routeHelpers";
import { FolderTotalCount, getTotalCountForFolder } from "../../util/folderHelpers";
import { useFolderResourceMetaSearch } from "../MyNdla/folderMutations";
import { BlockWrapper, ViewType } from "../MyNdla/Folders/FoldersPage";
import FoldersPageTitle from "../MyNdla/Folders/FoldersPageTitle";
import ListViewOptions from "../MyNdla/Folders/ListViewOptions";

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
  flex-direction: row;
  background-color: ${colors.brand.greyLightest};
  align-items: center;
  gap: ${spacing.nsmall};
  padding: ${spacing.normal};
  border: 2px solid ${colors.brand.neutral7};
  border-radius: 4px;

  margin: ${spacing.small} 0;

  ${mq.range({ from: breakpoints.mobileWide })} {
    margin: ${spacing.normal} 0;
  }
`;

const StyledRow = styled.div`
  margin: ${spacing.small} 0;
  gap: ${spacing.nsmall};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StyledInformationIcon = styled(HumanMaleBoard)`
  height: ${spacing.mediumlarge};
  width: ${spacing.mediumlarge};
`;

const FolderDescription = styled(Text)`
  font-style: italic;
`;

const ListItem = styled.li`
  list-style: none;
`;

interface Props {
  selectedFolder: GQLFolder;
  resources: GQLFolderResource[];
  viewType: ViewType;
  setViewType: (val: ViewType) => void;
}

export const SharedFolder = ({ selectedFolder, resources, viewType, setViewType }: Props) => {
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);

  const { data } = useFolderResourceMetaSearch(
    resources.map((res) => ({
      id: res.resourceId,
      path: res.path,
      resourceType: res.resourceType,
    })),
    { skip: resources.length === 0 },
  );

  const foldersCount = useMemo(
    () =>
      selectedFolder?.subfolders?.reduce<Record<string, FolderTotalCount>>((acc, curr) => {
        acc[curr.id] = getTotalCountForFolder(curr);
        return acc;
      }, {}),
    [selectedFolder?.subfolders],
  );

  const keyedData = keyBy(data ?? [], (resource) => `${resource.type}-${resource.id}`);
  const metaWithMetaImage = data?.find((d) => !!d.metaImage?.url);

  const Resource = viewType === "block" ? BlockResource : ListResource;

  const warningText = t(`myNdla.folder.sharing.warning.${authenticated ? "authenticated" : "unauthenticated"}`, {
    name: selectedFolder.owner?.name ?? t("myNdla.folder.professional"),
  });

  return (
    <div>
      <SocialMediaMetadata
        type="website"
        title={selectedFolder.name}
        imageUrl={metaWithMetaImage?.metaImage?.url}
        description={t("myNdla.sharedFolder.description.info")}
      >
        <meta name="robots" content="noindex, nofollow" />
      </SocialMediaMetadata>
      <SharedFolderInformationWrapper>
        <StyledInformationIcon />
        <Text margin="none" textStyle="meta-text-medium">
          {warningText}
        </Text>
      </SharedFolderInformationWrapper>
      <FoldersPageTitle key={selectedFolder?.id} selectedFolder={selectedFolder} enableBreadcrumb={false} />
      <FolderDescription margin="none" textStyle="content-alt">
        {selectedFolder.description ?? t("myNdla.folder.defaultPageDescription")}
      </FolderDescription>
      <StyledRow>
        <OptionsWrapper>
          <ListViewOptions type={viewType} onTypeChange={setViewType} />
        </OptionsWrapper>
      </StyledRow>
      {selectedFolder.subfolders.length > 0 && (
        <BlockWrapper data-type={viewType} data-no-padding={true}>
          {selectedFolder.subfolders.map(({ id, name }) => (
            <ListItem key={`folder-${id}`}>
              <Folder
                id={id}
                title={name}
                type={viewType}
                link={`${!authenticated ? routes.folder(id) : routes.myNdla.folderShared(id)}`}
                subFolders={foldersCount?.[id]?.folders}
                subResources={foldersCount?.[id]?.resources}
                isShared={false}
              />
            </ListItem>
          ))}
        </BlockWrapper>
      )}
      <BlockWrapper data-type={viewType} data-no-padding={true}>
        {selectedFolder.resources.map((resource) => {
          const resourceMeta = keyedData[`${resource.resourceType}-${resource.resourceId}`];
          return (
            <ListItem key={resource.id}>
              <Resource
                id={resource.id}
                tagLinkPrefix={routes.myNdla.tags}
                resourceImage={{
                  src: resourceMeta?.metaImage?.url ?? "",
                  alt: "",
                }}
                link={resource.path}
                tags={resource.tags}
                resourceTypes={resourceMeta?.resourceTypes ?? []}
                title={resourceMeta ? resourceMeta.title : t("myNdla.sharedFolder.resourceRemovedTitle")}
                description={viewType !== "list" ? resourceMeta?.description ?? "" : undefined}
              />
            </ListItem>
          );
        })}
      </BlockWrapper>
    </div>
  );
};

export default SharedFolder;
