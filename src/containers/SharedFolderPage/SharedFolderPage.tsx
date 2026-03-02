/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FolderUserLine } from "@ndla/icons";
import { Button, Heading, Text } from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { keyBy } from "@ndla/util";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageContainer } from "../../components/Layout/PageContainer";
import { BlockWrapper } from "../../components/MyNdla/BlockWrapper";
import { CopyFolderModal } from "../../components/MyNdla/CopyFolderModal";
import { Folder } from "../../components/MyNdla/Folder";
import { ListResource } from "../../components/MyNdla/ListResource";
import { MyNdlaTitle } from "../../components/MyNdla/MyNdlaTitle";
import { PageSpinner } from "../../components/PageSpinner";
import { PageTitle } from "../../components/PageTitle";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { GQLFolder, GQLMyNdlaResource } from "../../graphqlTypes";
import { useGetSharedFolder, useMyNdlaResourceMetaSearch } from "../../mutations/folder/folderQueries";
import { routes } from "../../routeHelpers";
import { isNotFoundError } from "../../util/handleError";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import { SaveLink } from "./components/SaveLink";

const flattenResources = (folder?: GQLFolder): GQLMyNdlaResource[] => {
  const subResources = folder?.subfolders.flatMap(flattenResources) ?? [];

  return (folder?.resources ?? []).concat(subResources);
};

const StyledPageContainer = styled(PageContainer, {
  base: {
    background: "background.strong",
    gap: "xxlarge",
  },
});

const TitleRow = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "xsmall",
  },
});

const ListSection = styled("section", {
  base: {
    display: "flex",
    maxWidth: "surface.pageMax",
    flexDirection: "column",
    gap: "medium",
  },
});

const InfoWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const HeadingWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const containsFolder = (folder: GQLFolder): boolean => {
  return !!folder.subfolders.find((subfolder) => containsFolder(subfolder)) || folder.resources.length > 0;
};

export const SharedFolderPage = () => {
  const { folderId = "" } = useParams();
  const { t } = useTranslation();
  const foldersHeadingId = useId();
  const resourcesHeadingId = useId();

  const { folder, loading, error } = useGetSharedFolder({
    id: folderId,
  });

  const { data } = useMyNdlaResourceMetaSearch(
    flattenResources(folder).map((res) => ({
      id: res.resourceId,
      path: res.path,
      resourceType: res.resourceType,
    })) ?? [],
    { skip: !folder || folder?.resources?.length === 0 },
  );

  const keyedData = keyBy(data ?? [], (resource) => `${resource.type}-${resource.id}`);
  const metaWithMetaImage = data?.find((d) => !!d.metaImage?.url);

  const getResourceMetaPath = (resource: GQLMyNdlaResource, resourceMeta: any) =>
    resourceMeta &&
    resourceMeta?.resourceTypes.length < 1 &&
    (resource.resourceType === "article" || resource.resourceType === "learningpath")
      ? `/${resource.resourceType}${resource.resourceType === "learningpath" ? "s" : ""}/${resource.resourceId}`
      : resource.path;

  if (loading) {
    return <PageSpinner />;
  }
  if (isNotFoundError(error)) {
    return <NotFoundPage />;
  }
  if (error || !folder) {
    return <DefaultErrorMessagePage />;
  }

  return (
    <StyledPageContainer asChild consumeCss>
      <main>
        <PageTitle title={folder.name} />
        <SocialMediaMetadata
          type="website"
          title={folder.name}
          imageUrl={metaWithMetaImage?.metaImage?.url}
          description={folder.description ?? t("myNdla.sharedFolder.description")}
        >
          <meta name="robots" content="noindex, nofollow" />
        </SocialMediaMetadata>
        <InfoWrapper>
          <HeadingWrapper>
            <TitleRow>
              <FolderUserLine size="large" />
              <MyNdlaTitle title={folder.name} />
            </TitleRow>
            <Text textStyle="label.medium" color="text.subtle">
              {t("myNdla.sharedFolder.sharedBy", { sharedBy: folder.owner?.name ?? t("myNdla.folder.professional") })}
            </Text>
          </HeadingWrapper>
          <Text textStyle="label.large">{folder.description ?? t("myNdla.folder.defaultPageDescription")}</Text>
        </InfoWrapper>
        <HStack gap="small">
          <CopyFolderModal folder={folder}>
            <Button variant="secondary">{t("myNdla.folder.copy")}</Button>
          </CopyFolderModal>
          <SaveLink folder={folder} />
        </HStack>
        {!!folder.subfolders.length && (
          <ListSection>
            <Heading asChild consumeCss textStyle="heading.small" id={foldersHeadingId}>
              <h2>{t("myNdla.folder.folders")}</h2>
            </Heading>
            <BlockWrapper aria-labelledby={foldersHeadingId}>
              {folder.subfolders.map((subFolder) =>
                containsFolder(subFolder) ? (
                  <li key={`folder-${subFolder.id}`}>
                    <Folder folder={subFolder} link={routes.folder(subFolder.id)} />
                  </li>
                ) : null,
              )}
            </BlockWrapper>
          </ListSection>
        )}
        {!!folder.resources.length && (
          <ListSection>
            <Heading asChild consumeCss textStyle="heading.small" id={resourcesHeadingId}>
              <h2>{t("myNdla.folder.resources")}</h2>
            </Heading>
            <BlockWrapper aria-labelledby={resourcesHeadingId}>
              {folder.resources.map((resource) => {
                const resourceMeta = keyedData[`${resource.resourceType}-${resource.resourceId}`];
                return resourceMeta ? (
                  <li key={resource.id}>
                    <ListResource
                      id={resource.id}
                      resourceImage={{
                        src: resourceMeta?.metaImage?.url,
                        alt: "",
                      }}
                      link={getResourceMetaPath(resource, resourceMeta)}
                      storedResourceType={resource.resourceType}
                      resourceTypes={resourceMeta.resourceTypes}
                      traits={
                        resourceMeta?.__typename === "MyNdlaArticleResourceMeta" ? resourceMeta.traits : undefined
                      }
                      title={resourceMeta ? resourceMeta.title : t("myNdla.sharedFolder.resourceRemovedTitle")}
                      description={resourceMeta?.description ?? ""}
                    />
                  </li>
                ) : null;
              })}
            </BlockWrapper>
          </ListSection>
        )}
      </main>
    </StyledPageContainer>
  );
};

export const Component = SharedFolderPage;
