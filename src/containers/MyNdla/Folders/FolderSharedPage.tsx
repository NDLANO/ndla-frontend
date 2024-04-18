/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { t } from "i18next";
import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Navigate } from "react-router-dom";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { Copy } from "@ndla/icons/action";
import { InformationOutline } from "@ndla/icons/common";
import { Subject } from "@ndla/icons/contentType";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { Text } from "@ndla/typography";
import { Folder, MessageBox } from "@ndla/ui";
import { ViewType } from "./FoldersPage";
import { AuthContext } from "../../../components/AuthenticationContext";
import CopyFolder from "../../../components/MyNdla/CopyFolder";
import CopyFolderModal from "../../../components/MyNdla/CopyFolderModal";
import { GQLFolder, GQLFolderResource } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import ErrorPage from "../../ErrorPage";
import NotFound from "../../NotFoundPage/NotFoundPage";
import SharedFolder from "../../SharedFolderPage/SharedFolder";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import SettingsMenu, { MenuItemProps } from "../components/SettingsMenu";
import { useGetSharedFolder, useSharedFolder } from "../folderMutations";

const flattenResources = (folder?: GQLFolder): GQLFolderResource[] => {
  if (!folder) {
    return [];
  }
  const subResources = folder.subfolders.flatMap(flattenResources);

  return folder.resources.concat(subResources);
};

const FolderSharedPage = () => {
  const { folderId = "", subfolderId } = useParams();
  const { authenticated } = useContext(AuthContext);
  const [viewType, setViewType] = useState<ViewType>("list");

  const { folder, loading, error } = useGetSharedFolder({
    id: folderId,
    includeResources: true,
    includeSubfolders: true,
  });

  const subFolder = useSharedFolder(subfolderId);
  const selectedFolder = !subfolderId ? folder : subFolder;
  const resources = flattenResources(folder);

  const buttons = useMemo(() => {
    if (!selectedFolder) return [];
    const copyFolder = (
      <CopyFolderModal folder={selectedFolder}>
        <ButtonV2 aria-label={t("myNdla.folder.copy")} variant="ghost">
          <Copy />
          {t("myNdla.folder.copy")}
        </ButtonV2>
      </CopyFolderModal>
    );
    const saveLink = <SaveLink folder={selectedFolder} />;
    return [copyFolder, saveLink];
  }, [selectedFolder]);

  const menu = useMemo(() => {
    if (!selectedFolder) return [];
    const copyFolder: MenuItemProps = {
      text: t("myNdla.folder.copy"),
      isModal: true,
      icon: <Copy />,
      modalContent: (close) => <CopyFolder folder={selectedFolder} onClose={close} />,
    };

    const saveLink: MenuItemProps = {
      text: t("myNdla.folder.sharing.button.saveLink"),
      isModal: true,
      icon: <Subject />,
      modalContent: (close) => <SaveLinkContent folder={selectedFolder} onClose={close} />,
    };
    return <SettingsMenu menuItems={[copyFolder, saveLink]} />;
  }, [selectedFolder]);

  if (!authenticated) {
    return <Navigate to={routes.folder(folderId)} />;
  }

  if (loading) {
    return <Spinner />;
  } else if (error?.graphQLErrors[0]?.extensions?.status === 404) {
    return <NotFound />;
  } else if (error || !selectedFolder) {
    return <ErrorPage />;
  }

  return (
    <MyNdlaPageWrapper buttons={buttons} dropDownMenu={menu} viewType={viewType} onViewTypeChange={setViewType}>
      <SharedFolder
        selectedFolder={selectedFolder}
        resources={resources}
        viewType={viewType}
        setViewType={setViewType}
      />
    </MyNdlaPageWrapper>
  );
};

export default FolderSharedPage;

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
}

const SaveLink = ({ folder }: SaveLinkProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <Modal open={open} onOpenChange={() => setOpen(!open)}>
      <ModalTrigger>
        <ButtonV2 aria-label={t("myNdla.folder.sharing.button.saveLink")} variant="ghost">
          <Subject />
          {t("myNdla.folder.sharing.button.saveLink")}
        </ButtonV2>
      </ModalTrigger>
      <SaveLinkContent folder={folder} onClose={() => setOpen(false)} />
    </Modal>
  );
};

interface SaveLinkContentProps extends SaveLinkProps {
  onClose: VoidFunction;
}

const SaveLinkContent = ({ folder: { id, name, subfolders, resources, status }, onClose }: SaveLinkContentProps) => {
  const onSave = () => {};

  return (
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
          <ButtonV2 variant="outline" onClick={onClose}>
            {t("close")}
          </ButtonV2>
          <ButtonV2 onClick={onSave}>{t("Save the link")}</ButtonV2>
        </ButtonRow>
      </ModalBody>
    </ModalContent>
  );
};
