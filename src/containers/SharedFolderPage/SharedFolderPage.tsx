/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import keyBy from "lodash/keyBy";
import { useContext, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { FileCopyLine, PresentationLine } from "@ndla/icons";
import { Button, Text } from "@ndla/primitives";
import { HStack, styled, VStack } from "@ndla/styled-system/jsx";
import { SaveLink } from "./components/SaveLink";
import { AuthContext } from "../../components/AuthenticationContext";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageContainer } from "../../components/Layout/PageContainer";
import { BlockWrapper } from "../../components/MyNdla/BlockWrapper";
import CopyFolderModal from "../../components/MyNdla/CopyFolderModal";
import { Folder } from "../../components/MyNdla/Folder";
import FoldersPageTitle from "../../components/MyNdla/FoldersPageTitle";
import ListResource from "../../components/MyNdla/ListResource";
import { PageSpinner } from "../../components/PageSpinner";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { GQLFolder, GQLFolderResource, GQLFoldersPageQuery } from "../../graphqlTypes";
import { routes } from "../../routeHelpers";
import { getResourceTypesForResource } from "../../util/folderHelpers";
import { useGetSharedFolder, useFolderResourceMetaSearch, foldersPageQuery } from "../MyNdla/folderMutations";
import { getFolderCount } from "../MyNdla/Folders/components/FolderList";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

const flattenResources = (folder?: GQLFolder): GQLFolderResource[] => {
  const subResources = folder?.subfolders.flatMap(flattenResources) ?? [];

  return (folder?.resources ?? []).concat(subResources);
};

const SharedFolderInformationWrapper = styled("div", {
  base: {
    maxWidth: "surface.xxlarge",
    display: "flex",
    backgroundColor: "background.subtle",
    alignItems: "center",
    gap: "xsmall",
    border: "1px solid",
    borderColor: "stroke.subtle",
    borderRadius: "4px",

    paddingBlock: "small",
    paddingInline: "medium",
  },
});

const FolderDescription = styled(Text, {
  base: {
    fontStyle: "italic",
  },
});

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "xsmall",
  },
});

const InformationWrapper = styled(VStack, {
  base: {
    alignItems: "start",
    paddingBlockEnd: "xlarge",

    tabletDown: {
      paddingBlockEnd: "small",
    },
  },
});

const containsFolder = (folder: GQLFolder): boolean => {
  return !!folder.subfolders.find((subfolder) => containsFolder(subfolder)) || folder.resources.length > 0;
};

const SharedFolderPage = () => {
  const { folderId = "" } = useParams();
  const { t } = useTranslation();

  const { authenticated } = useContext(AuthContext);

  const { folder, loading, error } = useGetSharedFolder({
    id: folderId,
    includeResources: true,
    includeSubfolders: true,
  });

  const { data: folderData } = useQuery<GQLFoldersPageQuery>(foldersPageQuery, {
    skip: !folder || !authenticated,
  });

  const { data } = useFolderResourceMetaSearch(
    flattenResources(folder).map((res) => ({
      id: res.resourceId,
      path: res.path,
      resourceType: res.resourceType,
    })) ?? [],
    { skip: !folder || folder?.resources?.length === 0 },
  );

  const keyedData = keyBy(data ?? [], (resource) => `${resource.type}-${resource.id}`);
  const metaWithMetaImage = data?.find((d) => !!d.metaImage?.url);

  const warningText = t(`myNdla.folder.sharing.warning.${authenticated ? "authenticated" : "unauthenticated"}`, {
    name: folder?.owner?.name ?? t("myNdla.folder.professional"),
  });

  const getResourceMetaPath = (resource: GQLFolderResource, resourceMeta: any) =>
    resourceMeta &&
    resourceMeta?.resourceTypes.length < 1 &&
    (resource.resourceType === "article" || resource.resourceType === "learningpath")
      ? `/${resource.resourceType}${resource.resourceType === "learningpath" ? "s" : ""}/${resource.resourceId}`
      : resource.path;

  const folderLinkIsSaved = useMemo(
    () => folderData?.folders.sharedFolders.some((f) => f.id === folderId),
    [folderData?.folders.sharedFolders, folderId],
  );

  const folderCount = useMemo(() => getFolderCount(folder?.subfolders ?? []), [folder?.subfolders]);

  if (loading) {
    return <PageSpinner />;
  }
  if (error?.graphQLErrors[0]?.extensions?.status === 404) {
    return <NotFoundPage />;
  }
  if (error || !folder) {
    return <DefaultErrorMessagePage />;
  }

  return (
    <StyledPageContainer asChild consumeCss>
      <main>
        <Helmet title={folder.name} />
        <SocialMediaMetadata
          type="website"
          title={folder.name}
          imageUrl={metaWithMetaImage?.metaImage?.url}
          description={t("myNdla.sharedFolder.description")}
        >
          <meta name="robots" content="noindex, nofollow" />
        </SocialMediaMetadata>
        <InformationWrapper gap="large">
          <SharedFolderInformationWrapper>
            <PresentationLine size="medium" />
            <Text textStyle="label.large">{warningText}</Text>
          </SharedFolderInformationWrapper>
          <HStack gap="small">
            <CopyFolderModal folder={folder}>
              <Button variant="tertiary">
                <FileCopyLine />
                {t("myNdla.folder.copy")}
              </Button>
            </CopyFolderModal>
            {!folderLinkIsSaved ? <SaveLink folder={folder} /> : null}
          </HStack>
        </InformationWrapper>
        <FoldersPageTitle key={folder?.id} selectedFolder={folder} enableBreadcrumb={false} />
        <FolderDescription textStyle="label.large">
          {folder.description ?? t("myNdla.folder.defaultPageDescription")}
        </FolderDescription>
        {!!folder.subfolders.length && (
          <BlockWrapper>
            {folder.subfolders.map((subFolder) =>
              containsFolder(subFolder) ? (
                <li key={`folder-${subFolder.id}`}>
                  <Folder
                    folder={subFolder}
                    link={routes.folder(subFolder.id)}
                    foldersCount={folderCount?.[subFolder.id]}
                  />
                </li>
              ) : null,
            )}
          </BlockWrapper>
        )}
        <BlockWrapper>
          {folder.resources.map((resource) => {
            const resourceMeta = keyedData[`${resource.resourceType}-${resource.resourceId}`];
            return resourceMeta ? (
              <li key={resource.id}>
                <ListResource
                  id={resource.id}
                  resourceImage={{
                    src: resourceMeta?.metaImage?.url ?? "",
                    alt: "",
                  }}
                  link={getResourceMetaPath(resource, resourceMeta)}
                  resourceTypes={getResourceTypesForResource(resource.resourceType, resourceMeta.resourceTypes, t)}
                  title={resourceMeta ? resourceMeta.title : t("myNdla.sharedFolder.resourceRemovedTitle")}
                  description={resourceMeta?.description ?? ""}
                />
              </li>
            ) : null;
          })}
        </BlockWrapper>
      </main>
    </StyledPageContainer>
  );
};

export default SharedFolderPage;
