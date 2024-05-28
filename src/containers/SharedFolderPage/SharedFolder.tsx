/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import keyBy from "lodash/keyBy";
import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { breakpoints, colors, misc, mq, spacing } from "@ndla/core";
import { Copy } from "@ndla/icons/action";
import { HumanMaleBoard, InformationOutline } from "@ndla/icons/common";
import { Subject } from "@ndla/icons/contentType";
import { ModalBody, Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalCloseButton } from "@ndla/modal";
import { Text } from "@ndla/typography";
import { BlockResource, Folder, ListResource, MessageBox, useSnack } from "@ndla/ui";
import { AuthContext } from "../../components/AuthenticationContext";
import CopyFolderModal from "../../components/MyNdla/CopyFolderModal";
import LoginModalContent from "../../components/MyNdla/LoginModalContent";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { GQLFolder, GQLFolderResource, GQLFolderResourceMeta } from "../../graphqlTypes";
import { routes } from "../../routeHelpers";
import { FolderTotalCount, getTotalCountForFolder } from "../../util/folderHelpers";
import { useFolderResourceMetaSearch, useSaveFolderResourceMutation } from "../MyNdla/folderMutations";
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
  list-style: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: ${spacing.normal} 0;
  margin-bottom: ${spacing.normal};
  gap: ${spacing.small};
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
      <div>
        <SharedFolderInformationWrapper>
          <StyledInformationIcon />
          <Text margin="none" textStyle="meta-text-medium">
            {warningText}
          </Text>
        </SharedFolderInformationWrapper>
        <ButtonContainer>
          <CopyFolderModal folder={selectedFolder}>
            <ButtonV2 variant="ghost">
              <Copy />
              {t("myNdla.folder.copy")}
            </ButtonV2>
          </CopyFolderModal>
          <SaveLink folder={selectedFolder} hideTrigger={() => {}} />
        </ButtonContainer>
      </div>
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
                link={routes.folder(id)}
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
                link={getResourceMetaPath(resource, resourceMeta)}
                tags={resource.tags}
                resourceTypes={getResourceMetaTypes(resource, resourceMeta)}
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

const Content = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: ${spacing.small};
  padding-top: ${spacing.large};
`;

interface SaveLinkProps {
  folder: GQLFolder;
  hideTrigger: () => void;
}

const SaveLink = ({ folder: { id, name, subfolders, resources, status }, hideTrigger }: SaveLinkProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { saveSharedFolder } = useSaveFolderResourceMutation(id);
  const { authenticated } = useContext(AuthContext);
  const { addSnack } = useSnack();

  const onSaveLink = () => {
    saveSharedFolder();
    hideTrigger();
    setOpen(false);
    addSnack({
      content: t("myNdla.folder.sharing.saveLink"),
      id: "sharedFolderSaved",
    });
  };

  return (
    <Modal open={open} onOpenChange={() => setOpen(!open)}>
      <ModalTrigger>
        <ButtonV2 aria-label={t("myNdla.folder.sharing.button.saveLink")} variant="ghost">
          <Subject />
          {t("myNdla.folder.sharing.button.saveLink")}
        </ButtonV2>
      </ModalTrigger>
      {authenticated ? (
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{t("myNdla.folder.sharing.save.header")}</ModalTitle>
            <ModalCloseButton title={t("modal.closeModal")} />
          </ModalHeader>
          <ModalBody>
            <Content>
              <Folder
                id={id}
                title={name}
                subFolders={subfolders.length}
                subResources={resources.length}
                link={routes.folder(id)}
                isShared={status === "shared"}
              />
              <MessageBox>
                <InformationOutline />
                <Text margin="none">{t("myNdla.folder.sharing.save.warning")}</Text>
              </MessageBox>
            </Content>
            <ButtonRow>
              <ButtonV2 variant="outline" onClick={() => setOpen(false)}>
                {t("close")}
              </ButtonV2>
              <ButtonV2 onClick={onSaveLink}>{t("myNdla.folder.sharing.button.saveLink")}</ButtonV2>
            </ButtonRow>
          </ModalBody>
        </ModalContent>
      ) : (
        <LoginModalContent
          title={t("myNdla.loginSaveFolderLinkPitch")}
          content={
            <Folder
              id={id.toString()}
              title={name ?? ""}
              link={`/folder/${id}`}
              isShared={true}
              subFolders={subfolders.length}
              subResources={resources.length}
            />
          }
        />
      )}
    </Modal>
  );
};
